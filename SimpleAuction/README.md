# Práctica Intermedia: Contrato de Subasta Simple

Este repositorio contiene un contrato inteligente de subasta simple desarrollado en Solidity. Este ejercicio es parte de una práctica intermedia para profundizar en temas de control de acceso, modificadores y eventos en contratos inteligentes.

## Descripción del Proyecto
El objetivo de este proyecto es crear un contrato de subasta donde los usuarios puedan hacer ofertas enviando Ether. La subasta tiene las siguientes características clave:

- **Ofertas (Bids):** Los usuarios pueden hacer ofertas enviando Ether al contrato.
- **Finalización de la subasta:** Solo el propietario de la subasta tiene el derecho de finalizar la subasta.
- **Registro de eventos:** El contrato registra eventos tanto para las ofertas realizadas como para la finalización de la subasta.
- **Aceptación de ofertas:** Solo se aceptan ofertas que sean mayores a la oferta más alta actual.

Este proyecto está diseñado para reforzar los conceptos de control de acceso, el uso de modificadores para verificar el estado de la subasta y la utilización de eventos para notificar cambios en el contrato.

## Tecnologías Utilizadas
- **Visual Studio Code:** Entorno de desarrollo utilizado para escribir y organizar el código del proyecto.
- **Solidity:** Lenguaje de programación utilizado para desarrollar el contrato inteligente.
- **Truffle + Ganache:** Herramientas para el desarrollo, compilación y pruebas de contratos inteligentes en una red local de pruebas.
- **React y Bootstrap:** Utilizados para construir la interfaz de usuario del frontend.
- **Web3.js:** Biblioteca para interactuar con la blockchain de Ethereum desde el frontend.
- **OpenZeppelin:** Biblioteca de contratos seguros para funcionalidades comunes, como control de acceso.
- **Metamask:** Billetera digital utilizada para interactuar con el contrato en redes de prueba.

## Funcionalidades del Contrato
1. **Modificadores:**
   - Se utilizan para verificar el estado de la subasta y restringir el acceso a ciertas funciones (como la finalización de la subasta por parte del propietario).

2. **Eventos:**
   - Se definen eventos para registrar y notificar cuando una oferta es realizada y cuando la subasta es finalizada.

3. **Control de Acceso:**
   - Solo el propietario del contrato puede finalizar la subasta, garantizando la seguridad del proceso.

## Ejecución del Contrato
1. **Hacer una oferta:** Los usuarios envían Ether al contrato mediante la función `bid`, siempre y cuando su oferta sea mayor a la actual.
2. **Finalizar la subasta:** El propietario del contrato puede finalizar la subasta llamando a la función `endAuction`.
3. **Registro de eventos:** Cada oferta y la finalización de la subasta generan un evento que es registrado en la blockchain.

## Requisitos Previos
Para interactuar con este contrato, necesitas tener configurado:
- **Metamask** con una cuenta en la red de prueba (por ejemplo, Rinkeby).
- **Ether de prueba** en tu cuenta de Metamask para realizar las ofertas en el contrato.

## Cómo Ejecutar el Proyecto
1. Clona este repositorio.
2. Abre el contrato en Visual Studio Code.
3. Usa Truffle para compilar y desplegar el contrato en Ganache o en una red de prueba.
4. Conéctate a la red de prueba de Ethereum (como Rinkeby) en Metamask.
5. Despliega el contrato y comienza a interactuar enviando ofertas y finalizando la subasta.