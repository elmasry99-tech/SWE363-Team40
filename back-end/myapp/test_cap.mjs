import cap from 'cap';
const devices = cap.Cap.deviceList();
console.log(JSON.stringify(devices.map(d => d.name), null, 2));
process.exit(0);
