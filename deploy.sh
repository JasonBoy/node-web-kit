#!/bin/sh
#Create by Jason <jasonlikenfs@gmail.com>
#This is meant for production
# > ./deploy.sh moduleName clusterNumber
ModuleName="app"
AllModules="all"
AppName=${ModuleName}
#Get/Set module name from argv
if [[ $# != 0 && $1 != "" ]]; then
  AppName=$1
fi
#echo ${AppName} $#
#Simple script to run app quickly
NodeVersion=$(node -v)
if [[ $? != 0 ]]; then
	#nodejs not installed yet
	echo ERROR: nodejs is not installed currently, pls install nodejs to continue
	exit
else
  echo node/${NodeVersion}, npm/$(npm -v)
fi

#GulpVersion=$(gulp -v)
#if [[ $? != 0 ]]; then
#	echo ERROR: pls install gulp to continue.[sudo npm install -g gulp]
#	exit
#fi
PMVersion=$(pm2 -v)
if [[ $? != 0 ]]; then
	echo ERROR: pls install pm2 to continue.[sudo npm install -g pm2]
	exit
fi

##uncoment this if you are in China...
#TaobaoRegistry="http://registry.npm.taobao.org/"
#NpmRegistry=$(npm config get registry)
#npm config set registry $TaobaoRegistry
#if [ "$TaobaoRegistry" != "$NpmRegistry" ]; then
#  echo changing npm registry "$NpmRegistry" to taobao registry
#  npm config set registry "$TaobaoRegistry"
#fi

#installing npm modules
echo installing npm modules...
npm install

#running gulp tasks
echo running gulp tasks...
npm run build

ClientScript="./bin/www"
#For just make it to ClientScript
AllModuleScript=${ClientScript}
RunScript=${ClientScript}
ClusterNumber=0
if [[ $2 != "" ]]; then
  ClusterNumber=$2
fi
#start or reload all apps
if [[ ${AppName} == ${AllModules} ]]; then
  if [[ "start" == $3 ]]; then
    pm2 start ${ClientScript} --no-vizion --name ${ModuleName} -i ${ClusterNumber}
  else
    pm2 reload all
  fi
  exit
fi

#check if app is running
AppStatus=$(pm2 show "$AppName" | grep -o "$AppName")
echo using ${RunScript}

if [[ ${AppStatus} != "" ]]; then
  echo ${AppName} is running, reloading ${AppName}
  pm2 reload ${AppName}
else
  echo ${AppName} is not running, starting ${AppName}
  pm2 start ${RunScript} --no-vizion --name ${AppName} -i ${ClusterNumber}
fi

