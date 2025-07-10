import { Icon } from "../ui";
import { tabsData } from "../../data/tabsData.jsx";

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-[#2d3748]">
      {tabsData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-4 text-center transition-colors ${
            activeTab === tab.id
              ? "bg-[#1eb980] text-white font-medium"
              : "text-gray-400 hover:text-gray-200 hover:bg-[#2d3748]/50"
          }`}>
          <div className="flex flex-col items-center">
            <div className="mb-1">
              <Icon>{tab.icon}</Icon>
            </div>
            <span className="text-xs uppercase tracking-wider">
              {tab.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
