const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://fei-ps:P123456@cluster-web.ztokaoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Web"
const client = new MongoClient(uri, { useNewUrlParser: true });

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
const res = require("express/lib/response");

var app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views','./views');
app.use(express.static('./public'));

var server = http.createServer(app);
server.listen(80);

console.log("Servidor rodando...");

//===FUNÇÕES===//

app.get('/', function (requisicao, resposta){ // Redireciona para a página de projetos
    resposta.redirect('Project.html')
})

app.post("/cadastra", function(req, res){
    newUser = req.body.user;
    newPass = req.body.password;
    enter = "Cadastrado com sucesso!"
    res.render('resposta', {newUser, enter})

})

app.post("/login", function(req, res){
    currentUser = req.body.user;
    currentPass = req.body.password;
    enter = "Falha!";

    if(currentUser == newUser && currentPass == newPass){
        enter = "Sucesso!";
        res.render('resposta', {newUser, enter})
    }else{
        res.render('resposta', {newUser, enter})
    }
})

// CRUD com MongoDB

app.post('/cadastrar_usuario', function(req, res) {
    // Salva os dados no DB
    client.db("Cluster-Web").collection("usuarios").insertOne(
        { 
            db_nome: req.body.nome, // req (function), body (html), nome (form name)
            db_login: req.body.login,
            db_senha: req.body.password 
        }, function (err) {
            if (err) {
                res.render('resposta_usuario', {resposta: "Erro ao cadastrar usuário!"})
            }else {
                res.render('resposta_usuario', {resposta: "Usuário cadastrado com sucesso!"})       
            };
      });   
});

app.post("/logar_usuario", function(req, res) {

    // busca um usuário no banco de dados
    client.db("Cluster-Web").collection("usuarios").find(
      {db_login: req.body.login, db_senha: req.body.password }).toArray(function(err, items) {
        console.log(items);
        if (items.length == 0) {
          res.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
        }else if (err) {
          res.render('resposta_usuario', {resposta: "Erro ao logar usuário!"})
        }else {
          res.render('resposta_usuario', {resposta: "Usuário logado com sucesso!"})       
        };
      });
 });

// Funções Att. 9 - Blog
app.get('/blog', function (req, res){ // Redireciona para a página principal
    // Busca todos os posts no banco de dados
    client.db("Cluster-Web").collection("posts").find().toArray(function(err,items) {
        res.render('resposta_blog', { posts: items });
    });
})

app.get('/criacao_post', function(req, res){ // Redireciona para a página de criação de posts
    app.use(express.static('./public/projetos/Dev. Web - Att 9 (Blog)'))
    res.redirect('criarPost.html')
    app.use(express.static('./public'))
})

app.get('/post_criado', function (req, res){ // Redireciona para a página resposta
    // Salva posts no banco
    if ((req.query.title != "") || (req.query.abstract != "") || (req.query.content != "")){
        client.db("Cluster-Web").collection("posts").insertOne(
        { db_title: req.query.title, db_abs: req.query.abstract, db_cont: req.query.content }, function (err) {
        if (err) {
            res.render('resposta_post', {mensagem: "Erro ao cadastrar post!"})
        }else {
            res.render('resposta_post', {mensagem: "Post cadastrado"})       
        };
        });
    }
    else{
        res.render('resposta_post', {mensagem: "Erro ao cadastrar post!"})
    }
})
