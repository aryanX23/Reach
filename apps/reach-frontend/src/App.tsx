import React from 'react';
import './App.css';
import { SocketProvider } from './contexts/socketContext';

function App() {
  const string = "Hello this is working";

  return (
		<>
			<SocketProvider>
				<div className="bg-red-400 border-spacing-1">{string}</div>
			</SocketProvider>
		</>
	);
}

export default App
