IF "%MONGODB_PATH%" == "" GOTO NOPATH

:YESPATH
GOTO FINALLY

:NOPATH
set MONGODB_PATH=\Program Files\MongoDB\Server\3.2\bin

:FINALLY
%MONGO_PATH%\mongod.exe --port 27017 --rest --dbpath \data\mongodb\ --bind_ip 127.0.0.1
