var cookie = require('cookie');
var escapeHtml = require('escape-html');
var http = require('http');
var url = require('url');
var math = require("mathjs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var nomisquadre = new Map;
var domandacorrente = new Map;
var fatte = new Map;
var link = Buffer.from('https://images.freeimages.com/images/large-previews/d09/spooky-trees-1151024.jpg');
var tot_link = ['https://i.postimg.cc/bdvL8svc/Whats-App-Image-2022-03-23-at-22-31-28.jpg','https://i.postimg.cc/2L3xxXt8/Whats-App-Image-2022-03-23-at-22-31-29.jpg','https://i.postimg.cc/R6gRKzXD/Whats-App-Image-2022-03-23-at-22-31-29-1.jpg','https://i.postimg.cc/7GH95LMz/Whats-App-Image-2022-03-23-at-22-31-29-2.jpg','https://i.postimg.cc/Y4f82Fgk/Whats-App-Image-2022-03-23-at-22-31-29-3.jpg' ];



var urlencodedParser = bodyParser.urlencoded({ extended: false });

function sfondo(numerodom) {

    link = Buffer.from(tot_link[numerodom]);



}



var dom0 = Buffer.from('son vestito in bianco e nero, ma non sono juventino. Lo puoi gridare forte perch&#232 sono il ... '+'\n (scrivere il nome degli oggetti che gli stanno poggiati sopra. 5 lettere)');
var dom1 = Buffer.from('quando si rompono nel paniere sono guai, queste per fortuna non si rompono mai...'+'\n (scrivere il nome del materiale dell oggetto. 5 lettere)');
var dom2 = Buffer.from('l&#180 amore &#232 cieco, il frutto si lanci, si trovi il giardino degli...'+'\n (non so ancora)');
var dom3 = Buffer.from('se vuoi trovarlo devi scendere laddove cercherai un simbolo di guerra'+'(scrivere il nome dell&#180 oggetto appeso al soffitto della stanza precedente. 10 lettere)');
var dom4 = Buffer.from('a Roma si chiamano nasoni, qua i nasi non ci sono, ma solo un antico grifone'+'\n (l&#180 oggetto da scrivere &#232 incastonato. 10 lettere)');
var domande = [dom0, dom1, dom2, dom3, dom4];

var risp0 = Buffer.from('libri');
var risp1 = Buffer.from('marmo');
var risp2 = Buffer.from('');
var risp3 = Buffer.from('bicicletta');
var risp4 = Buffer.from('conchiglia');

var risposte = [risp0, risp1, risp2, risp3, risp4];


app.post('/', urlencodedParser, function(req, res) {

    onRequest(req, res);
});


app.get('/', function(req, res) {


    onRequest(req, res);
});

app.post('/risposta', urlencodedParser, function(req, res) {

    risposta(req, res);

});

app.get('/risposta', urlencodedParser, function(req, res) {

    risposta(req, res);

});


function risposta(req, res) {
    var cookies = cookie.parse(req.headers.cookie || '');

    var nome = cookies.name;
    console.log(nome);
    var numero = String(nomisquadre.get(String(nome)));
    var num_domanda = domandacorrente.get(String(nome));
    var giusta = risposte[Number(num_domanda)];

    var risposta = req.body.risposta;
    console.log(String(risposta));
    if (String(risposta).toLowerCase() === String(giusta)) {

        //  res.write('<h1>risposta giusta!</h1>');
        nomisquadre.delete(String(nome));
        nomisquadre.set(String(nome), Number(numero) + 1);
        domandacorrente.delete(String(nome));
        // console.log(String(nomisquadre.get(String(nome))));
        var temp = (fatte.get(String(nome)));
        temp.push(Number(num_domanda));
        fatte.delete(String(nome));
        fatte.set(String(nome), temp);

        res.redirect('http://' + req.get('host') + '/inizio');

    } else {
        //var cod = codici[Number(num_domanda)];
        // res.end('<h1>risposta sbagliata!</h1>');
        //redirect alla stessa domanda di prima
        // res.redirect('http://' + req.get('host') + '/inizio/domanda?dom=' + String(cod));
        res.redirect('http://' + req.get('host') + '/inizio/domanda');
    }


};

app.get('/inizio/domanda', function(req, res) {

    var cookies = cookie.parse(req.headers.cookie || '');

    var nome = cookies.name;
    var numero = String(nomisquadre.get(String(nome)));
    var temp = (fatte.get(String(nome)));
    //console.log(req.query.dom);    
    var doman = domandacorrente.get(String(nome));

    // var idx = cc.indexOf(req.query.dom);
    // console.log(idx);
    //   var casuale = idx;


    //var domanda = domande[casuale];
    var domanda = domande[doman];


    // res.write('<HEAD><style>body { background-image: url(\':\\Users\\huawei\\OneDrive\\Desktop\\sistemi di calcolo 2\\9.11.21\\code\\.vscode\\comple\\prova.jpg\');}</style><style type="text/css">H1 {font-size:50px; color:black}</style></HEAD>');
    sfondo(doman);
    res.write('<HEAD><style>body { background-image: url(\'' + String(link) + '\');background-repeat: no-repeat;background-attachment: fixed;background-size: 100% 100%;}</style><style type="text/css">H1 {font-size:60px; color:#b8860b}</style></HEAD>');

    res.write('<div style="position: relative; top:35%; right:3%; text-align:center">');
    //res.write('<p style="background-image: url(\'prova.jpg\');">');

    res.write('<form method="POST" action=" ' + 'http://' + req.get('host') + '/risposta' + '">');
    res.write('<h1 style="color:red;">risposta sbagliata!</h1>');
    res.write('<h1>' + String(domanda) + '</h1>');
    // res.write('<form method="POST">');
    res.write('<input style="color:#b8860b;height:30px; width:600px"  placeholder="inserire risposta qua"   name="risposta"> <input   style="color:#b8860b;height:50px; width:100px" type="submit"  value="risposta">');
    res.write('</form>');
    res.write('</div>');
    res.end('</p>');


});


app.post('/inizio', urlencodedParser, function(req, res) {

    inizio(req, res);
});

app.get('/inizio', function(req, res) {

    inizio(req, res);
});

function inizio(req, res) {
    var cookies = cookie.parse(req.headers.cookie || '');

    var nome = cookies.name;
    var numero = String(nomisquadre.get(String(nome)));
    var temp = (fatte.get(String(nome)));
    if (temp && temp.length !== 0 && temp.length !== 5) { res.write('<h1 style="position: relative; top:35%; right:3%; text-align:center; color:#33FF66;">risposta giusta!</h1>'); }

    if (Number(numero) < 5) {

        var boolean = true;
        var casuale;

        if (!domandacorrente.has(String(nome))) {
            while (boolean) {

                casuale = math.randomInt(5);
                if (temp.indexOf(Number(casuale)) == -1) { boolean = false; }


            }


            domandacorrente.set(String(nome), Number(casuale));
        } else { casuale = domandacorrente.get(String(nome)); }


        var domanda = domande[casuale];


        //res.write('<HEAD><style>body { background-image: url(\':\\Users\\huawei\\OneDrive\\Desktop\\sistemi di calcolo 2\\9.11.21\\code\\.vscode\\comple\\prova.jpg\');}</style><style type="text/css">H1 {font-size:50px; color:black}</style></HEAD>');
        sfondo(casuale);

        res.write('<HEAD><style>body { background-image: url(\'' + String(link) + '\');background-repeat: no-repeat;background-attachment: fixed;background-size: 100% 100%;}</style><style type="text/css">H1 {font-size:60px; color:#b8860b}</style></HEAD>');


        res.write('<div style="position: relative; top:35%; right:3%; text-align:center">');
        //  res.write('<img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fotocommunity.it%2Fphoto%2Fscale-spettrali-francesco-sandrini%2F22667316&psig=AOvVaw2NDY6-trjkbY-dbQetOdZy&ust=1648057318113000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOjf7o2i2vYCFQAAAAAdAAAAABAD" width="100%" height="100%"');
        //res.write('<p style="background-image: url(\'prova.jpg\');">');

        res.write('<form method="POST" action=" ' + 'http://' + req.get('host') + '/risposta' + '">');
        res.write('<h1>' + String(domanda) + '</h1>');
        //res.write('<form method="POST">');
        res.write('<input style="color:#b8860b;height:30px; width:600px"  placeholder="inserire risposta qua"   name="risposta"> <input   style="color:#b8860b;height:50px; width:100px" type="submit"  value="risposta">');
        res.write('</form>');
        res.write('</div>');
        res.end('</p>');


    } else {
         // sfondo(casuale);
         res.write('<HEAD><style>body { background-image: url(\'' + String(link) + '\');background-repeat: no-repeat;background-attachment: fixed;background-size: 100% 100%;}</style><style type="text/css">H1 {font-size:60px; color:#b8860b}</style></HEAD>');


        res.write('<div style="position: relative; top:35%; right:3%; text-align:center">');
        res.write('<h1 style="color:#b8860b;">IL PREMIO TROVERAI SE DENTRO IL RIFLESSO CERCHERAI</h1>');
        res.end('<\div>');
        console.log(String(nome));
        console.log(String(fatte.get(String(nome))));


    }



};

function onRequest(req, res) {
    var flag = false;

    // Parse the query string
    //var query = url.parse(req.url, true, true).query;
    var nome;
    //    console.log(String(req.body));
    try {

        nome = req.body.name;

    } catch (error) {}

    if (nomisquadre.has(String(nome))) {

        flag = true;
        //console.log('nome gia registrato!');


    }

    if (nome && !nomisquadre.has(String(nome))) {




        nomisquadre.set(String(nome), 0);
        var arr = [];
        fatte.set(String(nome), arr);
        console.log(String(nome));
        // Set a new cookie with the name
        res.setHeader('Set-Cookie', cookie.serialize('name', String(nome), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week
        }));

        // Redirect back after setting cookie
        res.statusCode = 302;
        res.setHeader('Location', req.headers.referer || '/');
        res.end();

        return;
    }

    // Parse the cookies on the request
    var cookies = cookie.parse(req.headers.cookie || '');

    // Get the visitor name set in the cookie
    var name = cookies.name;

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');



    if (name) {


        res.write('<HEAD><style type="text/css">H1 {font-size:17px; color:#33FF66}</style></HEAD>');
        res.write('<HEAD><style>body { background-image: url(\'' + String(link) + '\');background-repeat: no-repeat;background-attachment: fixed;background-size: 100% 100%;}</style><style type="text/css">H1 {font-size:60px; color:#b8860b}</style></HEAD>');

        var temp = '<form action=" ' + 'http://' + req.get('host') + '/inizio' + '">';
        res.write('<div  style="position: relative; top:47%; right:3%; text-align:center" >');
        res.write(String(temp));
        res.write('<h1>la prima domanda indica la stanza dove recarsi, per poter poi scrivere il nome dell&#180 oggetto indicato tra parentesi</h1>');
        res.write('<input   style="height:50px; width:100px" type="submit"   value="inizio" >');

        res.write('</form>');
        res.end('</div>');



    } else {
        //  res.write('<HEAD><style type="text/css">H1 {font-size:60px; color:white}</style></HEAD>');
        res.write('<HEAD><style>body { background-image: url(\'' + String(link) + '\');background-repeat: no-repeat;background-attachment: fixed;background-size: 100% 100%;}</style><style type="text/css">H1 {font-size:60px; color:#b8860b}</style></HEAD>');
        res.write('<body>');
        res.write('<div style="position: relative; top:35%; right:3%; text-align:center";>');
        if (flag) {
            res.write('<h1 style="color:red;">nome già preso</h1>');
            flag = false;
        }
        res.write('<h1 style="color:#b8860b;">registrazione squadra</h1>');
        res.write('<form method="POST">');
        res.write('<input style="color:#b8860b; height:30px; width:600px"  placeholder="inserisci nome squadra"   name="name"> <input   style=" color:#b8860b; height:45px; width:80px" type="submit"  value="iscriviti">');

        res.write('</form>');
        res.write('</div>');
        res.end('</body>');
    }



}

var server = app.listen(process.env.PORT, function() {});
