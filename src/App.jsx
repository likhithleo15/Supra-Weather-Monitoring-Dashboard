import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import GlobeView from "./GlobeView";
import "./App.css";

function App() {
  const [weather, setWeather] = useState({
    temperature: 0,
    humidity: 0,
    wind: 0,
    rain: "false",
    status: "Loading..."
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const res = await fetch("/weather.json?t=" + Date.now());
        const data = await res.json();
        setWeather(data);

        setHistory((prev) => {
          const updated = [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              temp: Number(data.temperature),
              wind: Number(data.wind)
            }
          ];
          return updated.slice(-20);
        });
      } catch (err) {
        console.log("Awaiting LabVIEW telemetry...", err);
      }
    };

    loadWeather();
    const timer = setInterval(loadWeather, 1000);
    return () => clearInterval(timer);
  }, []);

  // Data for the Pie Chart based on Humidity
  const humidityValue = Number(weather.humidity) || 0;
  const pieData = [
    { name: "Moisture", value: humidityValue },
    { name: "Dry Air", value: 100 - humidityValue }
  ];
  const PIE_COLORS = ["#00eaff", "rgba(0, 234, 255, 0.1)"];

  return (
    <div className="dashboard-wrapper">
      <div className="header">
        SUPRA WEATHER MONITORING DASHBOARD (CONNECTED WITH LABVIEW)
      </div>

      <div className="main-grid">
        
        {/* LEFT COLUMN */}
        <div className="panel-column">
          <div className="cyber-panel">
            <div className="label">TEMPERATURE (C)</div>
            <div className="value">{Number(weather.temperature).toFixed(1)}°</div>
          </div>
          
          <div className="cyber-panel">
            <div className="label">HUMIDITY INDEX</div>
            <div className="value">{humidityValue.toFixed(1)}<span className="accent-text">%</span></div>
          </div>

          

          <div className="cyber-panel chart-panel">
            <div className="label">TEMPERATURE TREND</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00eaff" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#00eaff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 234, 255, 0.15)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  cursor={{ stroke: '#00eaff', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(5, 8, 16, 0.95)', 
                    border: '1px solid #00eaff', 
                    borderRadius: '6px',
                    padding: '12px 18px',
                    boxShadow: '0 0 15px rgba(0, 234, 255, 0.2)'
                  }} 
                  itemStyle={{ 
                    color: '#00eaff', 
                    fontSize: '32px', 
                    fontWeight: 'bold' 
                  }}
                  labelStyle={{ 
                    color: '#7b9cba', 
                    fontSize: '14px', 
                    letterSpacing: '1px',
                    marginBottom: '5px' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  name="SYS TEMP" 
                  unit="°C" 
                  stroke="#00eaff" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050810', 
                    border: '1px solid #00eaff', 
                    color: '#fff',
                    fontSize: '24px',
                    padding: '15px'
                  }} 
                  itemStyle={{ 
                    color: '#00eaff',
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}
                />
                
                <Area type="monotone" dataKey="temp" stroke="#00eaff" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CENTER COLUMN (GLOBE) */}
        <div className="center-panel">
          <div className="globe-container">
            <GlobeView />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="panel-column">
          <div className="cyber-panel">
            <div className="label">WIND VELOCITY</div>
            <div className="value-small">{Number(weather.wind).toFixed(1)} <span className="accent-text">KM/H</span></div>
          </div>

          <div className="cyber-panel">
            <div className="label">WEATHER STATUS</div>
            <div className="value-small" style={{ color: weather.rain === "true" ? "#00eaff" : "#fff" }}>
               {String(weather.status).toUpperCase()}
            </div>
          </div>

          <div className="cyber-panel chart-panel">
            <div className="label">MOISTURE LEVEL</div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={500}
                  outerRadius={530}
                  stroke="none"
                  dataKey="value"
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050810', 
                    border: '1px solid #00eaff', 
                    color: '#fff',
                    fontSize: '40px', /* INCREASE OVERALL BOX FONT SIZE */
                    fontWeight: 'bold',
                    padding: '30px' /* Adds breathing room around the bigger text */
                  }} 
                  itemStyle={{ 
                    color: '#00eaff',
                    fontSize: '60px' /* INCREASES THE ACTUAL DATA NUMBER SIZE */
                  }}
                />
              
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="branding">By Team Supra</div>
    </div>
  );
}

export default App;