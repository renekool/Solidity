import { Card } from "../ui";
import { tokenDescription, tokenFeatures } from "../../data/tokenFeatures";
import TokenFeature from "./TokenFeature";

const TokenDescription = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 text-green-400">
        {tokenDescription.title}
      </h2>
      <p className="text-gray-300 leading-relaxed">
        {tokenDescription.description}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {tokenFeatures.map((feature) => (
          <TokenFeature
            key={feature.id}
            id={feature.id}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </Card>
  );
};

export default TokenDescription;
