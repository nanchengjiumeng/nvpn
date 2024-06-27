#!/usr/bin/env node
const { execSync } = require("child_process");
const { readFileSync, existsSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const configFile = resolve("C://", process.env.HOMEPATH, ".nvpn.json");

if (!existsSync(configFile)) {
  writeFileSync(
    configFile,
    JSON.stringify({
      vpnname: "nvpn",
      username: "",
      password: "",
      routelist: [
        "192.168.191.0",
        "192.168.168.0",
        "192.168.11.0",
        "192.168.20.0",
        "192.168.9.0",
        "192.168.5.0",
        "36.134.0.0",
      ],
    })
  );
}

const { routelist, username, password, vpnname } = JSON.parse(
  readFileSync(configFile)
);

execSync(`rasdial ${vpnname || "nvpn"} ${username} ${password}`);

const ipconf = execSync("ipconfig").toString();
const matched = ipconf.match(/192\.168\.20\.(\d+)/);
if (matched) {
  const vpnId = matched[0];
  routelist.forEach((ip) => {
    console.log(ip, vpnId);
    execSync(`route delete ${ip}`);
    execSync(`route -p add ${ip} mask 255.255.255.0 ${vpnId}`);
  });
  console.log(execSync(`route print`).toString());
}

// hys:

//    连接特定的 DNS 后缀 . . . . . . . :
//    IPv4 地址 . . . . . . . . . . . . : 192.168.20.65
