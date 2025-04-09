// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./StakingToken.sol";
import "./RewardToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Propietario: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Alice: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
// Bob: 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db

/**
 * @title StakingPlatform
 * @dev Contrato para hacer staking de tokens y generar recompensas según un APR configurable.
 *      Además, se agrega un factor de aceleración (accelerator) para simular recompensas más rápidas.
 */
contract StakingPlatform is Ownable, ReentrancyGuard {
    StakingToken public staking;
    RewardToken public reward;

    // APR en basis points. Por ejemplo, 1250 equivale a un 12.50% anual.
    uint256 public apr;

    // Número de segundos en un año (365 días).
    // 365 días * 24 horas/día * 60 min/hora * 60 seg/min = 31536000 seg.
    uint256 private constant SECONDS_IN_YEAR = 31536000;

    // Factor de aceleración para simular recompensas más rápidas.
    // 1 significa sin aceleración; 2 significa el doble de rápido, etc.
    uint256 public accelerator = 100000;

    // Total de tokens apostados.
    uint256 public totalStaked;

    // Valor ficticio para RWD en USDT (para pruebas).
    // Queremos que 1 RWD valga $0.05. Con 8 decimales: 0.05 * 10^8 = 5000000.
    uint256 public constant FAKE_RWD_PRICE = 5000000;

    struct Staker {
        uint256 amount; // Tokens apostados por el usuario.
        uint256 lastUpdateTime; // Última vez que el usuario interactuó con el contrato.
        uint256 rewards; // Recompensas acumuladas hasta la última actualización.
    }

    mapping(address => Staker) public stakers;

    // Array para almacenar las direcciones de todos los stakers activos.
    address[] public stakerAddresses;

    /**
     * @dev Constructor que inicializa el contrato.
     * @param _stakingToken Dirección del contrato StakingToken.
     * @param _rewardToken Dirección del contrato RewardToken.
     * @param _apr APR inicial en basis points (por ejemplo, 1250 para 12.50% anual).
     */
    constructor(address _stakingToken, address _rewardToken, uint256 _apr) {
        staking = StakingToken(_stakingToken);
        reward = RewardToken(_rewardToken);
        apr = _apr;
    }

    /**
     * @notice Permite a los usuarios apostar tokens.
     * @param amount Cantidad de tokens a apostar.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cantidad invalida para staking");

        Staker storage staker = stakers[msg.sender];

        // Si es el primer staking del usuario, lo agregamos al array de stakers.
        if (staker.amount == 0) {
            stakerAddresses.push(msg.sender);
        }

        // Si ya tiene tokens apostados, actualizamos sus recompensas.
        if (staker.amount > 0) {
            staker.rewards = calculateRewards(msg.sender);
        }

        // Actualizamos el último timestamp.
        staker.lastUpdateTime = block.timestamp;

        // Transferimos tokens del usuario al contrato.
        staking.transferFrom(msg.sender, address(this), amount);
        staker.amount += amount;
        totalStaked += amount;
    }

    /**
     * @notice Permite a los usuarios retirar sus tokens apostados junto con las recompensas.
     */
    function unStake() external nonReentrant {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "Cantidad invalida para retirar");

        // Actualizamos las recompensas acumuladas antes de retirar.
        // Usamos "=" en lugar de "+=" para evitar duplicar lo ya acumulado.
        staker.rewards = calculateRewards(msg.sender);
        staker.lastUpdateTime = block.timestamp;

        uint256 rewardsToTransfer = staker.rewards;
        uint256 amountToReturn = staker.amount;

        // Reiniciamos los valores del usuario.
        staker.rewards = 0;
        staker.amount = 0;
        totalStaked -= amountToReturn;

        // Transferimos los tokens apostados y las recompensas acumuladas.
        staking.transfer(msg.sender, amountToReturn);
        reward.transfer(msg.sender, rewardsToTransfer);

        // Removemos la dirección del staker del array, ya que ya no está realizando staking.
        removeStaker(msg.sender);
    }

    /**
     * @notice Calcula las recompensas acumuladas para un usuario usando APR y un factor de aceleración.
     * @param user Dirección del usuario.
     * @return La cantidad total de recompensas acumuladas.
     *
     * Fórmula base:
     *   rewards = recompensas previas +
     *     (timeDifference * staker.amount * apr * accelerator) / (10000 * SECONDS_IN_YEAR)
     *
     * Donde:
     *   - apr/10000 es el APR anual en forma fraccionaria (por ejemplo, 1250 -> 0.125).
     *   - accelerator = 1 => sin aceleración, 2 => doble de rápido, etc.
     */
    function calculateRewards(address user) public view returns (uint256) {
        Staker storage staker = stakers[user];
        if (staker.amount == 0) {
            return staker.rewards;
        }

        uint256 timeDifference = block.timestamp - staker.lastUpdateTime;
        return
            staker.rewards +
            ((timeDifference * staker.amount * apr * accelerator) /
                (10000 * SECONDS_IN_YEAR));
    }

    /**
     * @notice Permite al owner actualizar el APR.
     * Antes de asignar el nuevo APR, liquida las recompensas acumuladas de todos los stakers
     * usando el APR anterior y actualiza su lastUpdateTime.
     * @param _apr Nuevo APR en basis points (por ejemplo, 3500 para 35.00% anual).
     */
    function setAPR(uint256 _apr) external onlyOwner {
        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            address stakerAddr = stakerAddresses[i];
            Staker storage staker = stakers[stakerAddr];
            // Liquidamos las recompensas utilizando el APR vigente.
            staker.rewards = calculateRewards(stakerAddr);
            // Reiniciamos el tiempo para que la nueva acumulación se realice con el nuevo APR.
            staker.lastUpdateTime = block.timestamp;
        }
        apr = _apr;
    }

    /**
     * @notice Permite al owner actualizar el factor de aceleración (accelerator).
     * @param _accelerator Nuevo factor de aceleración (1 = sin aceleración).
     */
    function setAccelerator(uint256 _accelerator) external onlyOwner {
        accelerator = _accelerator;
    }

    /**
     * @notice Obtiene el valor en USDT de las recompensas acumuladas para un usuario.
     * @param user Dirección del usuario.
     * @return El valor de las recompensas en USDT.
     *
     * Para pruebas, se utiliza un valor ficticio (FAKE_RWD_PRICE) que define el precio de RWD en USDT.
     * En este caso, FAKE_RWD_PRICE = 5000000, lo que significa que 1 RWD equivale a $0.05.
     */
    function getRewardValueInUSDT(address user) public view returns (uint256) {
        uint256 rewards = calculateRewards(user);
        uint256 usdtValue = (rewards * FAKE_RWD_PRICE) / (10 ** 8);
        return usdtValue;
    }

    /**
     * @dev Función interna para remover una dirección del array stakerAddresses.
     * Se utiliza cuando un usuario realiza unstake y ya no tiene tokens apostados.
     * @param stakerAddr Dirección del staker a remover.
     */
    function removeStaker(address stakerAddr) internal {
        uint256 length = stakerAddresses.length;
        for (uint256 i = 0; i < length; i++) {
            if (stakerAddresses[i] == stakerAddr) {
                stakerAddresses[i] = stakerAddresses[length - 1];
                stakerAddresses.pop();
                break;
            }
        }
    }
}
