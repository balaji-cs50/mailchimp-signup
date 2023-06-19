 const express = require("express");
 const bodyParser = require("body-parser");
 const request = require("request");
 const https = require("https");

 const app = express();

 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));

 app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
 });

 app.post("/", function(req, res){
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var email = req.body.email;


    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : fname,
                    LNAME : lname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/70efdb7b20";
    const options = {
        method : "POST",
        auth : "balu1:d0b96efc78cc94bfe552e206944c0444-us9"
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            if(JSON.parse(data).error_count == 1){
                res.sendFile(__dirname + "/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
            
        })
    });

    request.write(jsonData);
    request.end();

    console.log(fname, lname, email);
    var c = console.log("success");
    
 });

 app.post("/failure", function(req, res){
    res.redirect("/");
 });

 app.listen(3000, function(){
    console.log("Server is running is at port 3000");
 });


 // d0b96efc78cc94bfe552e206944c0444-us9

 // 70efdb7b20

//  For example, the following URL uses the fields query string parameter to only include the audience name (lists.name) and ID (lists.id) fields in the response:

// https://usX.api.mailchimp.com/3.0/lists?fields=lists.name,lists.id 

// However, if you wanted to return just the name of a specific audience, you would do so with the /lists/{list_id} endpoint and the audience name field should be referred to as name, like this:

// https://usX.api.mailchimp.com/3.0/lists/{list_id}?fields=name 

// This is because response for this endpoint returns a differently structured JSON object—name is at the top level, not embedded in another object named lists. 
