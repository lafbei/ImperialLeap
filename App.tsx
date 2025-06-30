import React, { useState, useEffect } from 'react';

// --- Helper Functions and Data ---

// Helper to generate unique IDs
const _uuid = () => crypto.randomUUID();

// --- Game Data ---
const goodsData = {
    'Fabric': { name: 'Fabric', baseCost: 20 }, 'Fish': { name: 'Fish', baseCost: 20 }, 'Grain': { name: 'Grain', baseCost: 20 },
    'Wood': { name: 'Wood', baseCost: 20 }, 'Meat': { name: 'Meat', baseCost: 30 }, 'Sugar': { name: 'Sugar', baseCost: 30 },
    'Clippers': { name: 'Clippers', baseCost: 60 }, 'Coal': { name: 'Coal', baseCost: 30 }, 'Dye': { name: 'Dye', baseCost: 40 },
    'Engines': { name: 'Engines', baseCost: 60 }, 'Explosives': { name: 'Explosives', baseCost: 50 }, 'Fertilizer': { name: 'Fertilizer', baseCost: 30 },
    'Glass': { name: 'Glass', baseCost: 40 }, 'Hardwood': { name: 'Hardwood', baseCost: 40 }, 'Iron': { name: 'Iron', baseCost: 40 },
    'Lead': { name: 'Lead', baseCost: 40 }, 'Oil': { name: 'Oil', baseCost: 40 }, 'Rubber': { name: 'Rubber', baseCost: 40 },
    'Silk': { name: 'Silk', baseCost: 40 }, 'Steel': { name: 'Steel', baseCost: 50 }, 'Sulfur': { name: 'Sulfur', baseCost: 50 },
    'Tools': { name: 'Tools', baseCost: 40 }, 'Ammunition': { name: 'Ammunition', baseCost: 50 }, 'Ironclads': { name: 'Ironclads', baseCost: 80 },
    'Small Arms': { name: 'Small Arms', baseCost: 60 }
};

const buildingsData = {
    'Construction Sector': { name: 'Construction Sector', cost: 1, type: 'Urban', urban: 1, pms: [ { category: 1, methods: [{ name: 'Wooden', in: {'Fabric': 1, 'Wood': 3}, out: {'Construction Cubes': 2} }, { name: 'Iron-Frame', in: {'Fabric': 1, 'Wood': 2, 'Iron': 3, 'Tools': 1}, out: {'Construction Cubes': 5} }, { name: 'Steel-Frame', in: {'Steel': 3, 'Glass': 2, 'Tools': 1}, out: {'Construction Cubes': 10} }] }] },
    'Barracks': { name: 'Barracks', cost: 1, type: 'Urban', urban: 2, pms: [ { category: 1, methods: [{ name: 'General Training', in: {'Small Arms': 5, 'Ammunition': 5}, out: {'Army Cubes': 1} }] }] },
    'Naval Base': { name: 'Naval Base', cost: 1, type: 'Urban', urban: 2, pms: [ { category: 1, methods: [{ name: 'Naval Traditions', in: {'Ironclads': 5}, out: {'Navy Cubes': 1} }] }] },
    'Wheat Farms': { name: 'Wheat Farms', cost: 2, type: 'Rural', urban: 0, pms: [ { category: 1, methods: [{ name: 'Simple Farming', in: {}, out: {'Grain': 2} }, { name: 'Soil-Enriching Farming', in: {'Fertilizer': 1}, out: {'Grain': 5} }] }, { category: 2, methods: [{ name: 'Single Crop', out: {} }, { name: 'Citrus Orchards', out: {'Grain': -2, 'Sugar': 2} }] }] },
    'Rice Farms': { name: 'Rice Farms', cost: 2, type: 'Rural', urban: 0, pms: [ { category: 1, methods: [{ name: 'Simple Farming', in: {}, out: {'Grain': 3} }, { name: 'Soil-Enriching Farming', in: {'Fertilizer': 2}, out: {'Grain': 7} }] }, { category: 2, methods: [{ name: 'Single Crop', out: {} }, { name: 'Fig Orchards', out: {'Grain': -3, 'Sugar': 3} }] }] },
    'Coal Mines': { name: 'Coal Mines', cost: 4, type: 'Rural', urban: 1, pms: [ { category: 1, methods: [{ name: 'Picks and Shovels', in: {}, out: {'Coal': 2} }, { name: 'Engine Pump', in: {'Tools': 1}, out: {'Coal': 4} }, { name: 'Diesel Pump', in: {'Tools': 1, 'Oil': 1}, out: {'Coal': 9} }] }, { category: 2, methods: [{ name: 'Manual Drilling', out: {} }, { name: 'Dynamite', in: {'Explosives': 1}, out: {'Coal': 2} }] }] },
    'Iron Mines': { name: 'Iron Mines', cost: 4, type: 'Rural', urban: 1, pms: [ { category: 1, methods: [{ name: 'Picks and Shovels', in: {}, out: {'Iron': 1} }, { name: 'Engine Pump', in: {'Tools': 1, 'Coal': 1}, out: {'Iron': 4} }, { name: 'Diesel Pump', in: {'Tools': 1, 'Oil': 1}, out: {'Iron': 7} }] }, { category: 2, methods: [{ name: 'Manual Drilling', out: {} }, { name: 'Dynamite', in: {'Explosives': 1}, out: {'Iron': 2} }] }] },
    'Lead Mines': { name: 'Lead Mines', cost: 4, type: 'Rural', urban: 1, pms: [ { category: 1, methods: [{ name: 'Picks and Shovels', in: {}, out: {'Lead': 1} }, { name: 'Engine Pump', in: {'Tools': 1, 'Coal': 1}, out: {'Lead': 4} }, { name: 'Diesel Pump', in: {'Tools': 1, 'Oil': 1}, out: {'Lead': 7} }] }, { category: 2, methods: [{ name: 'Manual Drilling', out: {} }, { name: 'Dynamite', in: {'Explosives': 1}, out: {'Lead': 2} }] }] },
    'Sulfur Mines': { name: 'Sulfur Mines', cost: 4, type: 'Rural', urban: 1, pms: [ { category: 1, methods: [{ name: 'Picks and Shovels', in: {}, out: {'Sulfur': 1} }, { name: 'Engine Pump', in: {'Tools': 1, 'Coal': 1}, out: {'Sulfur': 4} }, { name: 'Diesel Pump', in: {'Tools': 1, 'Oil': 1}, out: {'Sulfur': 7} }] }, { category: 2, methods: [{ name: 'Manual Drilling', out: {} }, { name: 'Dynamite', in: {'Explosives': 1}, out: {'Sulfur': 2} }] }] },
    'Fishing Wharves': { name: 'Fishing Wharves', cost: 2, type: 'Rural', urban: 1, pms: [{ category: 1, methods: [{ name: 'Simple Fishing', in: {}, out: {'Fish': 2} }, { name: 'Trawlers', in: {'Clippers': 1}, out: {'Fish': 5} }] }] },
    'Whaling Stations': { name: 'Whaling Stations', cost: 2, type: 'Rural', urban: 1, pms: [{ category: 1, methods: [{ name: 'Simple Whaling', in: {}, out: {'Meat': 1} }, { name: 'Whaling Fleet', in: {'Clippers': 1}, out: {'Meat': 2, 'Oil': 1} }] }] },
    'Cotton Plantations': { name: 'Cotton Plantations', cost: 2, type: 'Colonial', urban: 0, pms: [{ category: 1, methods: [{ name: 'Basic Production', in: {}, out: {'Fabric': 4} }, { name: 'Automatic Irrigation', in: {'Engines': 1}, out: {'Fabric': 8} }] }] },
    'Dye Plantations': { name: 'Dye Plantations', cost: 2, type: 'Colonial', urban: 0, pms: [{ category: 1, methods: [{ name: 'Basic Production', in: {}, out: {'Dye': 2} }, { name: 'Automatic Irrigation', in: {'Engines': 1}, out: {'Dye': 5} }] }] },
    'Sugar Plantations': { name: 'Sugar Plantations', cost: 2, type: 'Colonial', urban: 0, pms: [{ category: 1, methods: [{ name: 'Basic Production', in: {}, out: {'Sugar': 3} }, { name: 'Automatic Irrigation', in: {'Engines': 1}, out: {'Sugar': 6} }] }] },
    'Silk Plantations': { name: 'Silk Plantations', cost: 2, type: 'Colonial', urban: 0, pms: [{ category: 1, methods: [{ name: 'Basic Production', in: {}, out: {'Silk': 2} }, { name: 'Automatic Irrigation', in: {'Engines': 1}, out: {'Silk': 4} }] }] },
    'Rubber Plantations': { name: 'Rubber Plantations', cost: 2, type: 'Colonial', urban: 0, pms: [{ category: 1, methods: [{ name: 'Basic Production', in: {}, out: {'Rubber': 3} }, { name: 'Automatic Irrigation', in: {'Engines': 1}, out: {'Rubber': 6} }] }] },
    'Logging Camps': { name: 'Logging Camps', cost: 2, type: 'Rural', urban: 1, pms: [{ category: 1, methods: [{ name: 'Simple Forestry', in: {}, out: {'Wood': 3} }, { name: 'Saw Mills', in: {'Tools': 1}, out: {'Wood': 6} }] }] },
    'Oil Rigs': { name: 'Oil Rigs', cost: 4, type: 'Rural', urban: 1, pms: [{ category: 1, methods: [{ name: 'Steam-Powered Derricks', in: {'Coal': 1}, out: {'Oil': 5} }, { name: 'Combustion Engine Derricks', in: {'Engines': 1}, out: {'Oil': 10} }] }] },
    'Arms Industries': { name: 'Arms Industries', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Muskets', in: {'Iron': 1, 'Hardwood': 1}, out: {'Small Arms': 3} }, { name: 'Rifles', in: {'Steel': 2, 'Hardwood': 1, 'Tools': 1}, out: {'Small Arms': 7} }, { name: 'Bolt Action Rifles', in: {'Steel': 2, 'Hardwood': 1, 'Tools': 2, 'Oil': 1}, out: {'Small Arms': 10} }] }] },
    'Automotive Industries': { name: 'Automotive Industries', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Automobile Production', in: {'Engines': 1, 'Rubber': 1, 'Oil': 1}, out: {'Credits': 500} }] }] },
    'Electrics Industries': { name: 'Electrics Industries', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Telephone Production', in: {'Iron': 2, 'Rubber': 2, 'Lead': 2, 'Tools': 1}, out: {'Credits': 500} }] }] },
    'Explosives Factory': { name: 'Explosives Factory', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Leblanc Process', in: {'Sulfur': 2, 'Fertilizer': 2}, out: {'Explosives': 5} }] }] },
    'Fertilizer Plants': { name: 'Fertilizer Plants', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Artificial Fertilizers', in: {'Sulfur': 3, 'Iron': 1}, out: {'Fertilizer': 9} }] }] },
    'Food Industries': { name: 'Food Industries', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Bakeries', in: {'Grain': 4}, out: {'Credits': 120} }, { name: 'Sweeteners', in: {'Grain': 4, 'Sugar': 2}, out: {'Credits': 180} }] }, { category: 2, methods: [{ name: 'Jars', out: {} }, { name: 'Canned Meat', in: {'Grain': -2, 'Meat': 2, 'Iron': 1}, out: {'Credits': 90} }, { name: 'Canned Fish', in: {'Grain': -2, 'Fish': 3, 'Iron': 1}, out: {'Credits': 90} }, { name: 'Vacuum Packaging', in: {'Grain': -3, 'Fish': 3, 'Meat': 2, 'Iron': 1, 'Oil': 1}, out: {'Credits': 210} }] }] },
    'Furniture Manufactories': { name: 'Furniture Manufactories', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Handcrafted Furniture', in: {'Wood': 3, 'Fabric': 1}, out: {'Credits': 120} }, { name: 'Mechanized Workshops', in: {'Wood': 5, 'Fabric': 1, 'Tools': 1}, out: {'Credits': 330} }] }, { category: 2, methods: [{ name: 'Non-Luxury Furniture', out: {} }, { name: 'Luxury Furniture', in: {'Hardwood': 3, 'Tools': 1, 'Wood': -2}, out: {'Credits': 180} }] }] },
    'Glassworks': { name: 'Glassworks', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Forest Glass', in: {'Wood': 3}, out: {'Glass': 3} }, { name: 'Leaded Glass', in: {'Wood': 2, 'Lead': 1}, out: {'Glass': 4} }, { name: 'Plastics', in: {'Oil': 2, 'Lead': 3}, out: {'Glass': 10} }] }] },
    'Shipyards': { name: 'Shipyards', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Wooden Ships', in: {'Wood': 4, 'Fabric': 2}, out: {'Clippers': 3} }, { name: 'Reinforced Ships', in: {'Wood': 2, 'Hardwood': 2, 'Fabric': 2, 'Engines': 1}, out: {'Clippers': 7} }] }] },
    'Military Shipyards': { name: 'Military Shipyards', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Steel Hulls', in: {'Steel': 4, 'Coal': 3, 'Engines': 1}, out: {'Ironclads': 6} }] }] },
    'Motor Industries': { name: 'Motor Industries', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Steam Engines', in: {'Steel': 3}, out: {'Engines': 4} }, { name: 'Diesel Engines', in: {'Steel': 5, 'Oil': 5}, out: {'Engines': 12} }] }] },
    'Munition Plants': { name: 'Munition Plants', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Percussion Caps', in: {'Explosives': 2, 'Lead': 2}, out: {'Ammunition': 5} }, { name: 'Explosive Shells', in: {'Explosives': 4, 'Lead': 3}, out: {'Ammunition': 9} }] }] },
    'Steel Mills': { name: 'Steel Mills', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Blister Steel Process', in: {'Iron': 4, 'Coal': 3}, out: {'Steel': 7} }, { name: 'Bessemer Process', in: {'Iron': 6, 'Coal': 3}, out: {'Steel': 9} }] }] },
    'Synthetics Plants': { name: 'Synthetics Plants', cost: 8, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Synthetic Dye', in: {'Sulfur': 2, 'Fertilizer': 2}, out: {'Dye': 8} }] }, { category: 2, methods: [{ name: 'Dye Production', out: {} }, { name: 'Rayon', in: {'Wood': 1}, out: {'Dye': -1, 'Silk': 3} }] }] },
    'Textile Mills': { name: 'Textile Mills', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Handsewn', in: {'Fabric': 4}, out: {'Credits': 150} }, { name: 'Sewing Machines', in: {'Fabric': 6, 'Dye': 1, 'Tools': 1}, out: {'Credits': 300} }] }, { category: 2, methods: [{ name: 'Non-Luxury Clothes', out: {} }, { name: 'Craftsman Sewing', in: {'Silk': 2, 'Fabric': -2}, out: {'Credits': 210} }] }] },
    'Tooling Workshop': { name: 'Tooling Workshop', cost: 6, type: 'Urban', urban: 2, pms: [{ category: 1, methods: [{ name: 'Crude Tools', in: {'Wood': 3}, out: {'Tools': 3} }, { name: 'Iron Tools', in: {'Wood': 3, 'Iron': 2}, out: {'Tools': 6} }, { name: 'Steel Tools', in: {'Wood': 3, 'Steel': 2}, out: {'Tools': 8} }, { name: 'Machined Tools', in: {'Rubber': 1, 'Steel': 3}, out: {'Tools': 11} }] }] },
};

const allRuralBuildingNames = Object.values(buildingsData).filter(b => b.type === 'Rural').map(b => b.name);
const allColonialBuildingNames = Object.values(buildingsData).filter(b => b.type === 'Colonial').map(b => b.name);
const MAX_BUILDING_LEVEL = 3;

// --- React Components ---

const ResourceDisplay = ({ playerState }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b border-gray-600 pb-2">Player Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="font-semibold text-green-400">Credits:</p>
                    <p className="text-2xl text-white">{playerState.credits.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="font-semibold text-blue-400">Urbanization:</p>
                    <p className="text-2xl text-white">{playerState.urbanization}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="font-semibold text-red-400">Army Cubes:</p>
                    <p className="text-2xl text-white">{playerState.armyCubes}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-md">
                    <p className="font-semibold text-cyan-400">Navy Cubes:</p>
                    <p className="text-2xl text-white">{playerState.navyCubes}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-md xl:col-span-1">
                    <p className="font-semibold text-purple-400">Construction:</p>
                    <p className="text-2xl text-white">{playerState.constructionCubes}</p>
                </div>
            </div>
            <h3 className="text-lg font-bold text-yellow-400 mt-4 mb-2 border-b border-gray-600 pb-2">Warehouse (Goods)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 text-sm">
                {Object.entries(playerState.goods).sort((a,b) => a[0].localeCompare(b[0])).map(([good, amount]) => (
                    amount > 0 && <div key={good} className="bg-gray-700 p-2 rounded-md flex justify-between items-center">
                        <span className="text-gray-300">{good}:</span>
                        <span className="font-bold text-white">{amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BuildingCard = ({ building, playerState, onProduce, onUpgrade }) => {
    const [selectedPMs, setSelectedPMs] = useState({});

    useEffect(() => {
        const initialPMs = {};
        building.pms.forEach(pmCategory => {
            if(pmCategory.methods.length > 0) initialPMs[pmCategory.category] = pmCategory.methods[0].name;
        });
        setSelectedPMs(initialPMs);
    }, [building]);

    const handlePMChange = (category, pmName) => {
        setSelectedPMs(prev => ({...prev, [category]: pmName}));
    };

    const canProduce = () => {
        const totalInputs = {};
        building.pms.forEach(pmCat => {
            const selected = pmCat.methods.find(m => m.name === selectedPMs[pmCat.category]);
            if (selected && selected.in) {
                 for (const [good, amount] of Object.entries(selected.in)) {
                     if (amount > 0) totalInputs[good] = (totalInputs[good] || 0) + (amount * building.level);
                 }
            }
        });
        return Object.entries(totalInputs).every(([good, amount]) => playerState.goods[good] >= amount);
    };

    const handleProduceClick = () => {
        if (canProduce()) onProduce(building.id, selectedPMs);
    };
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex flex-col h-full">
            <h3 className="text-lg font-bold text-yellow-300">{building.name} <span className="text-sm text-gray-400"> (Lvl {building.level})</span></h3>
            <p className="text-xs text-gray-400 mb-3">Type: {building.type} | Urban: {building.urban}</p>
            <div className="flex-grow">
                {building.pms.map(pmCategory => (
                    <div key={pmCategory.category} className="mb-3">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Production Method {pmCategory.category > 1 ? pmCategory.category : ''}</label>
                        <select 
                            value={selectedPMs[pmCategory.category] || ''}
                            onChange={(e) => handlePMChange(pmCategory.category, e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                        >
                            {pmCategory.methods.map(pm => <option key={pm.name} value={pm.name}>{pm.name}</option>)}
                        </select>
                         <div className="text-xs mt-1 p-2 bg-gray-900 rounded">
                             {(() => {
                                const selected = pmCategory.methods.find(m => m.name === selectedPMs[pmCategory.category]);
                                if (!selected) return null;
                                const inputs = Object.entries(selected.in || {});
                                const outputs = Object.entries(selected.out || {});
                                return ( <>
                                        <p className="text-green-400">Out: {outputs.map(([k,v]) => `${v>0?'+':''}${v * building.level} ${k}`).join(', ') || 'None'}</p>
                                        <p className="text-red-400">In: {inputs.map(([k,v]) => `${v * building.level} ${k}`).join(', ') || 'None'}</p>
                                    </> );
                             })()}
                         </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-2">
                <button onClick={handleProduceClick} disabled={!canProduce() || building.hasProducedThisTurn}
                    className="w-full py-2 px-4 rounded-md font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    Produce
                </button>
                {building.type === 'Urban' && (
                     <button onClick={() => onUpgrade(building.id)} 
                        disabled={playerState.constructionCubes < building.cost || building.level >= MAX_BUILDING_LEVEL || building.name === 'Barracks' || building.name === 'Naval Base'}
                        className="w-full py-2 px-4 rounded-md font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Upgrade ({building.cost} CC)
                    </button>
                )}
            </div>
        </div>
    );
};

const MarketView = ({ globalMarket, playerState, onTrade }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 border-b border-gray-600 pb-2">Global Market</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.values(globalMarket.prices).sort((a,b) => a.name.localeCompare(b.name)).map(good => (
                    <div key={good.name} className="bg-gray-700 p-3 rounded-md">
                        <p className="font-bold text-lg text-white">{good.name}</p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-gray-400">Buy Price:</span>
                            <span className="text-green-400 font-semibold">${Math.round(good.buyPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Sell Price:</span>
                            <span className="text-red-400 font-semibold">${Math.round(good.sellPrice)}</span>
                        </div>
                         <div className="flex justify-between items-center text-xs mt-1">
                            <span className="text-gray-500">Market Qty:</span>
                            <span className="text-gray-300">{globalMarket.supply[good.name] || 0}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => onTrade(good.name, 'buy', 1)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md text-xs transition-colors">Buy 1</button>
                            <button disabled={!playerState.goods[good.name] || playerState.goods[good.name] < 1} onClick={() => onTrade(good.name, 'sell', 1)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md text-xs transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Sell 1</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WarfareView = ({ availableBuildings, playerState, onConquer }) => {
    const canConquer = playerState.armyCubes >= 2 && playerState.credits >= 500;
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b border-gray-600 pb-2">Available for Conquest</h2>
            <p className="text-sm text-gray-400 mb-4">Cost to conquer: 2 Army Cubes & 500 Credits</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBuildings.map(building => {
                    const existingBuilding = playerState.buildings.find(b => b.name === building.name);
                    const isMaxLevel = existingBuilding && existingBuilding.level >= MAX_BUILDING_LEVEL;
                    return (
                        <div key={building.name} className="bg-gray-700 p-3 rounded-md flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-lg text-white">{building.name}</p>
                                <p className="text-xs text-gray-400">Type: {building.type}</p>
                                {isMaxLevel && <p className="text-xs text-red-400 font-bold">Max level</p>}
                            </div>
                            <button onClick={() => onConquer(building.name)} disabled={!canConquer || isMaxLevel}
                                className="w-full mt-3 py-1 px-2 rounded-md font-semibold text-gray-900 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm">
                                {existingBuilding ? 'Upgrade' : 'Conquer'}
                            </button>
                        </div>
                    );
                 })}
            </div>
        </div>
    );
};

const ColonizationView = ({ availableBuildings, playerState, onColonize }) => {
    const canColonize = playerState.navyCubes >= 1 && playerState.constructionCubes >= 2 && playerState.credits >= 500;
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b border-gray-600 pb-2">Available to Colonize</h2>
            <p className="text-sm text-gray-400 mb-4">Cost: 1 Navy Cube, 2 CC & 500 Credits</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBuildings.map(building => {
                    const existingBuilding = playerState.buildings.find(b => b.name === building.name);
                    const isMaxLevel = existingBuilding && existingBuilding.level >= MAX_BUILDING_LEVEL;
                    return (
                        <div key={building.name} className="bg-gray-700 p-3 rounded-md flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-lg text-white">{building.name}</p>
                                <p className="text-xs text-gray-400">Type: {building.type}</p>
                                {isMaxLevel && <p className="text-xs text-red-400 font-bold">Max level</p>}
                            </div>
                            <button onClick={() => onColonize(building.name)} disabled={!canColonize || isMaxLevel}
                                className="w-full mt-3 py-1 px-2 rounded-md font-semibold text-gray-900 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm" >
                                {existingBuilding ? 'Upgrade' : 'Colonize'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ConstructionView = ({ onBuild, constructableBuildings, playerState }) => {
    const [showOnlyAffordable, setShowOnlyAffordable] = useState(false);

    const playerBuildingNames = playerState.buildings.map(b => b.name);
    
    const unbuiltBuildings = constructableBuildings.filter(b => !playerBuildingNames.includes(b.name));
    
    const buildingsToList = showOnlyAffordable
        ? unbuiltBuildings.filter(b => b.cost <= playerState.constructionCubes)
        : unbuiltBuildings;
        
    return (
         <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full">
            <h2 className="text-xl font-bold text-yellow-400 mb-3 border-b border-gray-600 pb-2">Construction</h2>
             <div className="flex items-center my-2">
                <input id="affordable-filter" type="checkbox" checked={showOnlyAffordable} onChange={e => setShowOnlyAffordable(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-600" />
                <label htmlFor="affordable-filter" className="ml-2 text-sm text-gray-300">Show only affordable</label>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                {buildingsToList.map(b => {
                    const canAfford = playerState.constructionCubes >= b.cost;
                    return (
                        <div key={b.name} className={`bg-gray-700 p-3 rounded-md flex justify-between items-center ${!canAfford && 'opacity-60'}`}>
                            <div>
                                <p className="font-semibold text-white">{b.name}</p>
                                <p className="text-sm text-purple-300">Cost: {b.cost} CC</p>
                            </div>
                            <button onClick={() => onBuild(b.name)} disabled={!canAfford}
                                className="py-2 px-4 rounded-md font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors text-sm">
                                Build
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default function App() {
    // --- Game State ---
    const [playerState, setPlayerState] = useState({
        credits: 0, urbanization: 0, armyCubes: 0, navyCubes: 0, constructionCubes: 0,
        goods: {}, buildings: [], constructable: []
    });
    const [globalMarket, setGlobalMarket] = useState({
        prices: {}, supply: Object.keys(goodsData).reduce((acc, good) => ({...acc, [good]: 100}), {})
    });
    const [availableRuralBuildings, setAvailableRuralBuildings] = useState([]);
    const [availableColonialBuildings, setAvailableColonialBuildings] = useState([]);
    const [turn, setTurn] = useState(1);
    const [message, setMessage] = useState("Welcome to Industrial Leap!");
    const [activeTab, setActiveTab] = useState('main');

    // --- Game Logic Functions ---
    const calculateMarketPrices = () => {
        const newPrices = {};
        for (const [name, good] of Object.entries(goodsData)) {
            const marketSupply = globalMarket.supply[name] || 0;
            const priceModifier = Math.max(0.1, 100 / (100 + marketSupply * 0.5));
            const basePrice = good.baseCost;
            newPrices[name] = { name: name, buyPrice: basePrice * priceModifier * 1.1, sellPrice: basePrice * priceModifier * 0.9 };
        }
        setGlobalMarket(prev => ({ ...prev, prices: newPrices }));
    };
    
    useEffect(() => {
        const initialCredits = 1000, initialConstruction = 5;
        const initialGoods = Object.keys(goodsData).reduce((acc, good) => ({...acc, [good]: 0}), {});

        const startingMines = ['Iron Mines', 'Coal Mines', 'Sulfur Mines', 'Lead Mines'];
        const otherRural = ['Wheat Farms', 'Rice Farms', 'Fishing Wharves', 'Whaling Stations', 'Logging Camps'];
        
        const randomMineName = startingMines[Math.floor(Math.random() * startingMines.length)];
        const randomRuralName = otherRural[Math.floor(Math.random() * otherRural.length)];
        
        const initialBuildings = [randomMineName, randomRuralName].map(name => {
            const data = buildingsData[name];
            return { ...data, id: _uuid(), level: 1, hasProducedThisTurn: true, selectedPMs: data.pms.reduce((acc, cat) => ({...acc, [cat.category]: cat.methods[0].name }), {}) };
        });
        
        const initialUrbanization = initialBuildings.reduce((sum, b) => sum + (b.urban * b.level), 0);

        let ruralPool = [...allRuralBuildingNames];
        const initialConquest = [];
        for(let i=0; i<3; i++){
            if(ruralPool.length === 0) break;
            const randomIndex = Math.floor(Math.random() * ruralPool.length);
            const buildingName = ruralPool.splice(randomIndex, 1)[0];
            initialConquest.push(buildingsData[buildingName]);
        }
        setAvailableRuralBuildings(initialConquest);
        
        let colonialPool = [...allColonialBuildingNames];
        const initialColonial = [];
        for(let i=0; i<3; i++){
            if(colonialPool.length === 0) break;
            const randomIndex = Math.floor(Math.random() * colonialPool.length);
            const buildingName = colonialPool.splice(randomIndex, 1)[0];
            initialColonial.push(buildingsData[buildingName]);
        }
        setAvailableColonialBuildings(initialColonial);

        setPlayerState(prev => ({
            ...prev, credits: initialCredits, urbanization: initialUrbanization, constructionCubes: initialConstruction, 
            goods: initialGoods, buildings: initialBuildings, constructable: Object.values(buildingsData).filter(b => b.type === 'Urban')
        }));
        
        calculateMarketPrices();
        setMessage("Welcome to Industrial Leap! Produce goods, build your industry, or end your turn.");
    }, []);
    
    useEffect(() => { calculateMarketPrices(); }, [globalMarket.supply]);

    const handleEndTurn = () => {
        setPlayerState(prev => {
            const buildingsReady = prev.buildings.map(b => ({ ...b, hasProducedThisTurn: false }));
            return { ...prev, buildings: buildingsReady, constructionCubes: prev.constructionCubes + 2 };
        });
        setTurn(t => t + 1);
        setMessage(`Turn ${turn + 1}. You gained 2 Construction Cubes. All buildings are ready to produce.`);
    };
    
    const handleBuild = (buildingName) => {
        const buildingInfo = buildingsData[buildingName];
        if (!buildingInfo) return;
        if (playerState.constructionCubes < buildingInfo.cost) { setMessage("Not enough Construction Cubes!"); return; }

        setPlayerState(prev => {
            const newBuilding = { ...buildingInfo, id: _uuid(), level: 1, hasProducedThisTurn: true, selectedPMs: buildingInfo.pms.reduce((acc, cat) => ({...acc, [cat.category]: cat.methods[0].name }), {}) };
            const newBuildings = [...prev.buildings, newBuilding];
            const newUrbanization = newBuildings.reduce((sum, b) => sum + (b.urban * b.level), 0);
            return { ...prev, constructionCubes: prev.constructionCubes - buildingInfo.cost, buildings: newBuildings, urbanization: newUrbanization };
        });
        setMessage(`Constructed a new ${buildingName}! It can produce next turn.`);
    };
    
    const handleTrade = (goodName, type, amount) => {
        const priceInfo = globalMarket.prices[goodName];
        if (!priceInfo) return;
        const cost = Math.round(priceInfo.buyPrice * amount);
        const revenue = Math.round(priceInfo.sellPrice * amount);
        
        setPlayerState(prev => {
            const newGoods = { ...prev.goods };
            let newCredits = prev.credits;
            if (type === 'buy') {
                if (newCredits < cost) { setMessage("Not enough credits!"); return prev; }
                newCredits -= cost;
                newGoods[goodName] = (newGoods[goodName] || 0) + amount;
                setMessage(`Bought 1 ${goodName} for $${cost}`);
            } else {
                if (!newGoods[goodName] || newGoods[goodName] < amount) { setMessage(`Not enough ${goodName} to sell!`); return prev; }
                newCredits += revenue;
                newGoods[goodName] -= amount;
                setMessage(`Sold 1 ${goodName} for $${revenue}`);
            }
             return { ...prev, credits: newCredits, goods: newGoods };
        });

        setGlobalMarket(prev => {
            const newSupply = {...prev.supply};
            newSupply[goodName] = type === 'buy' ? Math.max(0, newSupply[goodName] - amount) : (newSupply[goodName] || 0) + amount;
            return { ...prev, supply: newSupply };
        });
    };
    
    const handleProduce = (buildingId, selectedPMs) => {
        setPlayerState(prev => {
            const building = prev.buildings.find(b => b.id === buildingId);
            if (!building || building.hasProducedThisTurn) return prev;
            
            const totalInputs = {}, totalOutputs = {};
            const level = building.level;

            building.pms.forEach(pmCat => {
                const pmName = selectedPMs[pmCat.category];
                const selected = pmCat.methods.find(m => m.name === pmName);
                if (selected) {
                    Object.entries(selected.in || {}).forEach(([g,a]) => totalInputs[g] = (totalInputs[g]||0)+a);
                    Object.entries(selected.out || {}).forEach(([g,a]) => totalOutputs[g] = (totalOutputs[g]||0)+a);
                }
            });

            const newGoods = { ...prev.goods };
            for (const [good, amount] of Object.entries(totalInputs)) {
                if (newGoods[good] < (amount * level)) { setMessage(`Not enough ${good} for ${building.name}.`); return prev; }
                newGoods[good] -= (amount * level);
            }

            let { credits, armyCubes, navyCubes, constructionCubes } = { ...prev };
            for (const [good, amount] of Object.entries(totalOutputs)) {
                const scaledAmount = amount * level;
                if (good === 'Credits') credits += scaledAmount;
                else if (good === 'Army Cubes') armyCubes += scaledAmount;
                else if (good === 'Navy Cubes') navyCubes += scaledAmount;
                else if (good === 'Construction Cubes') constructionCubes += scaledAmount;
                else newGoods[good] = (newGoods[good] || 0) + scaledAmount;
            }

            const updatedBuildings = prev.buildings.map(b => b.id === buildingId ? { ...b, hasProducedThisTurn: true } : b);

            setMessage(`Production successful at ${building.name}!`);
            return { ...prev, buildings: updatedBuildings, goods: newGoods, credits, armyCubes, navyCubes, constructionCubes };
        });
    };

    const handleConquer = (buildingName) => {
        const armyCost = 2, creditCost = 500;
        const existingBuilding = playerState.buildings.find(b => b.name === buildingName);

        if (existingBuilding && existingBuilding.level >= MAX_BUILDING_LEVEL) { setMessage(`${buildingName} is already at max level!`); return; }
        if (playerState.armyCubes < armyCost || playerState.credits < creditCost) { setMessage("Not enough resources to conquer!"); return; }
        
        setPlayerState(prev => {
            const buildingInfo = buildingsData[buildingName];
            let newBuildings, newUrbanization;

            if (existingBuilding) {
                newBuildings = prev.buildings.map(b => b.name === buildingName ? { ...b, level: b.level + 1} : b);
                setMessage(`Upgraded ${buildingName} to Level ${existingBuilding.level + 1}!`);
            } else {
                const newBuilding = { ...buildingInfo, id: _uuid(), level: 1, hasProducedThisTurn: true, selectedPMs: buildingInfo.pms.reduce((acc, cat) => ({...acc, [cat.category]: cat.methods[0].name }), {}) };
                newBuildings = [...prev.buildings, newBuilding];
                setMessage(`Successfully conquered ${buildingName}! It can produce next turn.`);
            }
            newUrbanization = newBuildings.reduce((sum, b) => sum + (b.urban * b.level), 0);
            return { ...prev, armyCubes: prev.armyCubes - armyCost, credits: prev.credits - creditCost, buildings: newBuildings, urbanization: newUrbanization };
        });

        setAvailableRuralBuildings(prev => {
            const remaining = prev.filter(b => b.name !== buildingName);
            const pool = allRuralBuildingNames.filter(name => !remaining.some(b => b.name === name));
            if (pool.length > 0) return [...remaining, buildingsData[pool[Math.floor(Math.random() * pool.length)]]];
            return remaining;
        });
    };
    
    const handleColonize = (buildingName) => {
        const navyCost = 1, ccCost = 2, creditCost = 500;
        const existingBuilding = playerState.buildings.find(b => b.name === buildingName);

        if (existingBuilding && existingBuilding.level >= MAX_BUILDING_LEVEL) { setMessage(`${buildingName} is already at max level!`); return; }
        if (playerState.navyCubes < navyCost || playerState.constructionCubes < ccCost || playerState.credits < creditCost) { setMessage("Not enough resources to colonize!"); return; }
        
        setPlayerState(prev => {
             const buildingInfo = buildingsData[buildingName];
            let newBuildings, newUrbanization;

            if(existingBuilding) {
                newBuildings = prev.buildings.map(b => b.name === buildingName ? { ...b, level: b.level + 1} : b);
                setMessage(`Upgraded ${buildingName} to Level ${existingBuilding.level + 1}!`);
            } else {
                const newBuilding = { ...buildingInfo, id: _uuid(), level: 1, hasProducedThisTurn: true, selectedPMs: buildingInfo.pms.reduce((acc, cat) => ({...acc, [cat.category]: cat.methods[0].name }), {}) };
                newBuildings = [...prev.buildings, newBuilding];
                setMessage(`Successfully colonized ${buildingName}! It can produce next turn.`);
            }
            newUrbanization = newBuildings.reduce((sum, b) => sum + (b.urban * b.level), 0);
            return { ...prev, navyCubes: prev.navyCubes - navyCost, constructionCubes: prev.constructionCubes - ccCost, credits: prev.credits - creditCost, buildings: newBuildings, urbanization: newUrbanization };
        });

        setAvailableColonialBuildings(prev => {
            const remaining = prev.filter(b => b.name !== buildingName);
            const pool = allColonialBuildingNames.filter(name => !remaining.some(b => b.name === name));
            if (pool.length > 0) return [...remaining, buildingsData[pool[Math.floor(Math.random() * pool.length)]]];
            return remaining;
        });
    };

    const handleUpgrade = (buildingId) => {
        setPlayerState(prev => {
            const buildingToUpgrade = prev.buildings.find(b => b.id === buildingId);
            if (!buildingToUpgrade) return prev;
            if (buildingToUpgrade.name === 'Barracks' || buildingToUpgrade.name === 'Naval Base') { setMessage("This building cannot be upgraded."); return prev; }
            if (buildingToUpgrade.level >= MAX_BUILDING_LEVEL) { setMessage("Building is already at max level!"); return prev; }
            if (prev.constructionCubes < buildingToUpgrade.cost) { setMessage("Not enough Construction Cubes to upgrade!"); return prev; }

            const newBuildings = prev.buildings.map(b => b.id === buildingId ? { ...b, level: b.level + 1 } : b);
            const newUrbanization = newBuildings.reduce((sum, b) => sum + (b.urban * b.level), 0);

            setMessage(`Upgraded ${buildingToUpgrade.name} to Level ${buildingToUpgrade.level + 1}!`);
            return { ...prev, buildings: newBuildings, constructionCubes: prev.constructionCubes - buildingToUpgrade.cost, urbanization: newUrbanization, };
        });
    };

    const TabButton = ({ tabName, children }) => {
        const isActive = activeTab === tabName;
        return (
            <button onClick={() => setActiveTab(tabName)} className={`py-2 px-4 text-lg font-semibold rounded-t-lg transition-colors ${ isActive ? 'bg-gray-800 text-yellow-300' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                {children}
            </button>
        )
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-4">
            <div className="container mx-auto">
                <header className="relative text-center mb-4 pb-4 border-b border-gray-700">
                    <h1 className="text-4xl font-bold text-yellow-300 tracking-wider">Industrial Leap</h1>
                    <p className="text-gray-400">Turn: <span className="font-bold">{turn}</span></p>
                    {message && <div className="mt-2 p-2 bg-blue-900 border border-blue-700 text-blue-200 rounded-md inline-block max-w-lg">{message}</div>}
                    <button onClick={handleEndTurn} className="absolute top-0 right-0 py-2 px-6 rounded-md font-semibold text-gray-900 bg-red-500 hover:bg-red-600 transition-colors">End Turn</button>
                </header>

                <nav className="flex space-x-2 border-b-2 border-gray-800">
                   <TabButton tabName="main">Main</TabButton>
                   <TabButton tabName="market">Global Market</TabButton>
                   <TabButton tabName="expand">Expand Nation</TabButton>
                </nav>

                <main className="pt-4">
                    {activeTab === 'main' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <ResourceDisplay playerState={playerState} />
                                <div>
                                    <h2 className="text-2xl font-bold text-yellow-400 mb-3 mt-4 border-b border-gray-600 pb-2">Your Industries</h2>
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                        {playerState.buildings.sort((a,b) => a.name.localeCompare(b.name)).map(b => (
                                            <BuildingCard key={b.id} building={b} playerState={playerState} onProduce={handleProduce} onUpgrade={handleUpgrade} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <ConstructionView onBuild={handleBuild} constructableBuildings={playerState.constructable} playerState={playerState} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'market' && <MarketView globalMarket={globalMarket} playerState={playerState} onTrade={handleTrade} />}
                    {activeTab === 'expand' && (
                        <div className="space-y-6">
                            <WarfareView availableBuildings={availableRuralBuildings} playerState={playerState} onConquer={handleConquer} />
                            <ColonizationView availableBuildings={availableColonialBuildings} playerState={playerState} onColonize={handleColonize} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
