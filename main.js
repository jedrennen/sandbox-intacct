/**
 * My API Sandbox
 * 
 */
 
// A basic route returning a canned response
Sandbox.define('/hello', 'get', function(req, res) {
    // send 'Hello world' response
    res.send('Hello world');
});


// Using stateful behaviour to simulate creating users
Sandbox.define('/users', 'POST', function(req, res) {
    // retrieve users or, if there are none, init to empty array
    state.users = state.users || [];
    
    // persist user by adding to the state object
    state.users.push(req.body);

    return res.json({status: "ok"});
});

// Using stateful behaviour to simulate getting all users
Sandbox.define('/users', 'GET', function(req, res) {
    // retrieve users or, if there are none init, to empty array
    state.users = state.users || [];

    return res.json(state.users);
});

// Using named route parameters to simulate getting a specific user
Sandbox.define('/users/{username}', 'GET', function(req, res) {
    // retrieve users or, if there are none, init to empty array
    state.users = state.users || [];

    // route param {username} is available on req.params
    var username = req.params.username;

    // log it to the console
    console.log("Getting user " + username + " details");

    // use lodash to find the user in the array
    var user = _.find(state.users, { "username": username});
    
    return res.json(user);
});

Sandbox.define('/xmlgw-xml', 'POST', function(req, res) {
    // Check the request, make sure it is a compatible type
    if (!req.is('text/xml')) {
        var ctype = req.headers['Content-Type'];
        return res.send(400, 'Invalid content type, expected x-intacct-xml-request, got ' + req.headers['Content-Type']);
    }
    
    // Test the xmlDoc
    res.type('application/json');
    res.status(200);
    return res.json({ xml: req.xmlDoc, body: req.body });
})

Sandbox.define('/xmlgw.phtml','POST', function(req, res) {
    // Check the request, make sure it is a compatible type
    if (!(req.is('text/xml') || req.headers['Content-Type'] == 'x-intacct-xml-request')) {
        var ctype = req.headers['Content-Type'];
        return res.send(400, 'Invalid content type, expected x-intacct-xml-request, got ' + req.headers['Content-Type']);
    }

    // This doesn't work because http isn't loaded    
    var http = require('http');
    var connector = http.request({
        host: 'http://intacct.getsandbox.com',
        path: '/xmlgw-xml',
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml'
        },
        body: req.body
    }, function(resp) {
        resp.pipe(res);
    });
    
    // This doesn't work: TypeError: res.redirect is not a function in main.js at line number 83
    // res.redirect('/xmlgw-xml');
    
    // Test the xmlDoc
    // res.type('application/json');
    // res.status(200);
    // return res.json({ xml: req.xmlDoc, body: req.body });
    
    // Set the type of response, sets the content type.
    // res.type('text/xml');
    
    // // Set the status code of the response.
    // res.status(200);
    
    // var dt = new Date();
    // var utcDate = dt.toUTCString();
    // //var isoDate = utcDate.toISOString();
    
    // // parse the body
    // var senderid = req.xmlDoc.get("//request/control/senderid").text()
    
    // // Send the response body.
    // res.render('getAPISession-success', { timestamp: utcDate, user: { senderid: 'mysender', senderpassword: 'supersecret'} });
})

Sandbox.define('/text-xml','GET', function(req, res) {
    // Check the request, make sure it is a compatible type
    if (!(req.is('text/xml') || req.headers['Content-Type'] == 'x-intacct-xml-request')) {
        var ctype = req.headers['Content-Type'];
        return res.send(400, 'Invalid content type, expected text/xml not "' + ctype + '"');
    }
    
    // Set the type of response, sets the content type.
    res.type('application/json');
    
    // Set the status code of the response.
    res.status(200);
    
    // Send the response body.
    res.json({
        "status": "ok"
    });
})