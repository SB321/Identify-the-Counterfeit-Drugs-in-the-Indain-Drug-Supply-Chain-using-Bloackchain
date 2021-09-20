var exec = require('child_process').exec;



exec('./deployChaincode.sh', function (error, stdOut, stdErr) {
    // console.log(stdErr)
    if (error) {
        console.log("\n" + stderr);
    } else {
        console.log(JSON.parse(stdOut));
    }
});
