const TokenFeature = ({ id, title, description }) => {
  return (
    <div className="flex items-start group">
      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[#1eb980] flex items-center justify-center mt-0.5 group-hover:bg-[#1eb980]/80 transition-colors">
        <span className="text-xs font-bold text-[#1e293b]">{id}</span>
      </div>
      <div className="ml-3">
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default TokenFeature;
