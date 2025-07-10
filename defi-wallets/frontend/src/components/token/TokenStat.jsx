import { Card, Badge } from "../ui";

const TokenStat = ({
  title,
  value,
  suffix,
  suffixColor,
  badge,
  placeholder,
  placeholderClass,
  valueClass,
}) => {
  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      {value ? (
        <div className={`flex items-center ${valueClass}`}>
          {value}
          {suffix && (
            <span className={`text-sm ${suffixColor} ml-1`}>{suffix}</span>
          )}
          {badge && (
            <Badge variant={badge.variant} className="ml-2">
              {badge.text}
            </Badge>
          )}
        </div>
      ) : (
        <span className={placeholderClass}>{placeholder}</span>
      )}
    </Card>
  );
};

export default TokenStat;
