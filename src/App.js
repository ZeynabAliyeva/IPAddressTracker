import arrow from './assets/images/icon-arrow.svg';
import bg from './assets/images/pattern-bg.png';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Makerposition from './components/Makerposition';
import './App.css'

function App() {
	const [address, setAddress] = useState(null);
	const [ipAddress, setIpAddress] = useState('');
	const checkIpAddress =
		/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
	const checkDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

	useEffect(() => {
		try {
			const getInitialData = async () => {
				const res = await fetch(
					`https://geo.ipify.org/api/v2/country,city?apiKey=at_1wyJczZXWMNHS9fbdYX5xC02OThsS&ipAddress=8.8.8.8`
				);
				const data = await res.json();
				setAddress(data);
			};

			getInitialData();
		} catch (error) {
			console.trace(error);
		}
	}, []);

	const getEnteredData = async () => {
		const res = await fetch(
			`https://geo.ipify.org/api/v2/country,city?apiKey=at_1wyJczZXWMNHS9fbdYX5xC02OThsS&ipAddress&${
				checkIpAddress.test(ipAddress)
					? `ipAddress=${ipAddress}`
					: checkDomain.test(ipAddress)
					? `domain=${ipAddress}`
					: ''
			}`
		);
		const data = await res.json();
		setAddress(data);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		getEnteredData();
		setIpAddress('');
	};

	return (
		<>
			<section>
				<div className="img-container">
					<img className="img" src={bg} alt="" />
				</div>
				<div className="input-container">
					<h1 className="title-ip">IP Address Tracker</h1>
					<form onSubmit={handleSubmit}>
						<input
							value={ipAddress}
							onChange={(e) => setIpAddress(e.target.value)}
							type="text"
							name="ipaddress"
							id="ipaddress"
							placeholder="Search for any IP Address"
						/>
						<button type="submit">
							<img src={arrow} alt="arrow" />
						</button>
					</form>
				</div>

				{address && (
					<dic className="container">
						<div className="information">
							<div>
								<h2>IP ADsress</h2>
								<p>{address.ip}</p>
							</div>
							<div>
								<h2>Location</h2>
								<p>
									{address.location.city}, {address.location.region}
								</p>
							</div>
							<div>
								<h2>Timezone</h2>
								<p>UTC {address.location.timezone}</p>
							</div>
							<div>
								<h2>ISP</h2>
								<p>{address.isp}</p>
							</div>
						</div>
						<MapContainer
							className="mapContainer"
							center={[address?.location.lat, address?.location.lng]}
							zoom={13}
							scrollWheelZoom={true}
							style={{ height: '100vh', width: '100vw' }}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<Makerposition address={address} />
						</MapContainer>
					</dic>
				)}
			</section>
		</>
	);
}

export default App;
