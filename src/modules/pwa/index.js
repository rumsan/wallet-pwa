import React, { useEffect, useState } from 'react';

export default function Index() {
	const [users, setUsers] = useState([]);
	const [online, setOnline] = useState(true);

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(response => response.json())
			.then(data => {
				setUsers(data);
				localStorage.setItem('users_list', JSON.stringify(data));
			})
			.catch(err => {
				setOnline(false);
				let users = localStorage.getItem('users_list');
				if (users && users.length) setUsers(JSON.parse(users));
			});
	}, []);

	return (
		<div id="appCapsule">
			<div id="cmpMain">
				{!online && (
					<div
						style={{ marginTop: 20 }}
						id="offline-toast"
						className="toast-box bg-danger toast-top tap-to-close show"
					>
						<div className="in">
							<div className="text">No Internet Connection!</div>
						</div>
					</div>
				)}
				<div>
					<ul>
						{users.length > 0 &&
							users.map(item => {
								return (
									<li style={{ margin: 15 }} key={item.id}>
										<h4>{item.name}</h4>
									</li>
								);
							})}
					</ul>
				</div>
			</div>
		</div>
	);
}
