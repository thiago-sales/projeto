// Carregando módulos
  const express = require('express')
  const handlebars = require('express-handlebars')
  const bodyParser = require('body-parser')
  const app = express()
  const admin = require('./routes/admin')
  const path = require('path')
  const mongoose = require('mongoose')
  const session = require('express-session')
  const flash = require('connect-flash')
  require('./models/Postagem')
  const Postagem = mongoose.model('postagens')
  require('./models/Categoria')
  const Categoria = mongoose.model('categorias')
  const usuarios = require('./routes/usuario')
  const passport = require('passport')
  require('./config/auth')(passport)
  const db = require('./config/db')
  const multer = require('multer')
  const {eAdmin} = require('./helpers/eAdmin')


//Configurações
	// Sessão
		app.use(session({
			secret: "cursodenode",
			resave: true,
			saveUninitialized: true
		}))
		app.use(flash())
		//configuração do passport
		app.use(passport.initialize())
		app.use(passport.session())


	// Middleware
		app.use((req,res,next)=>{
			res.locals.success_msg = req.flash('success_msg')
			res.locals.error_msg = req.flash('error_msg')
			res.locals.error = req.flash('error')
			res.locals.user = req.user || null;
			next() 
		})
	// Body Parser
		app.use(bodyParser.urlencoded({extended: true}))
		app.use(bodyParser.json())
	// Handlebars
		app.engine('handlebars', handlebars({defaultlayout: 'main'}))
		app.set('view engine', 'handlebars');
	//Multer (upload de arquivos pelo Admin)
		const upload = multer({dest: 'uploads/'})	
	// Mongoose
		mongoose.Promise = global.Promise;
		mongoose.connect(db.mongoURI).then(()=>{
			console.log('Conectado ao mongo')
		}).catch((err)=>{
			console.log('Erro ao se conectar: ' + err)
		})
	// Public
		app.use(express.static(path.join(__dirname, 'public')))

// Rotas
	app.get('/', (req,res)=>{
		// se der erro falta um .lean()
		Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens)=>{
			res.render('index', {postagens: postagens})
		}).catch((err)=>{
			req.flash('error_msg', 'Houve um erro interno')
			res.redirect('/404')
		})
	})

	app.get('/postagem/:slug', (req,res)=>{
		//sempre colocar o: .lean() depois da função findOne()
		Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
			if(postagem){
				res.render('postagem/index', {postagem: postagem})
			}else{
				req.flash('error_msg', 'Esta postagem não existe')
				res.redirect('/')
			}
		}).catch((err)=>{
			req.flash('error_msg', 'Houve um erro interno')
			res.redirect('/')
		})
	})

	app.get('/categorias', eAdmin, (req,res)=>{
		//talvez precise de um .lean()
		Categoria.find().lean().then((categorias)=>{
			res.render('categorias/index', {categorias: categorias})
		}).catch((err)=>{
			req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
			res.redirect('/')
		})
	})

	app.get('/categorias/:slug', (req,res)=>{
		//Revisar as funções findOne() se elas tem um: .lean()
		Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
			if(categoria){
				//o erro é nesse bloco de código
				Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{
					
					res.render('categorias/postagens', {postagens: postagens, categoria: categoria})

				}).catch((err)=>{
					req.flash('error_msg', 'Houve um erro ao listar os posts!')
					res.redirect('/')
				})

			}else{
				req.flash('error_msg', 'Esta categoria não existe')
				res.redirect('/')
			}
		}).catch((err)=>{
			req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
			res.redirect('/')
		})
	})

	app.get('/404', (req,res)=>{
		res.send('Erro 404!')
	})

	//rota Contato
	app.get('/contato', (req,res)=>{
		res.render('contato/index')
	})


	//rota da Manossolfa Digital
	app.get('/manossolfa', eAdmin, (req,res)=>{
		res.render('manossolfa/manossolfa')
	})

	//rota da página help (ajuda)
	app.get('/ajuda', (req,res) =>{
		res.render('ajuda/ajuda')
	})


	//CURSOS
	app.get('/cursos', eAdmin, (req,res)=>{
		res.render('cursos/index')
	})


	//ROTA TEORIA
	app.get('/teoria', eAdmin, (req,res)=>{
		res.render('teoria/index')
	})
	//teoria aula 01
	app.get('/teoria/aula1', eAdmin, (req,res)=>{
		res.render('teoria/aula1')
	})
	//teoria aula 02
	app.get('/teoria/aula2', eAdmin, (req,res)=>{
		res.render('teoria/aula2')
	})
	//teoria aula 03
	app.get('/teoria/aula3', eAdmin, (req,res)=>{
		res.render('teoria/aula3')
	})
	//teoria aula 04
	app.get('/teoria/aula4', eAdmin, (req,res)=>{
		res.render('teoria/aula4')
	})
	//teoria aula 05
	app.get('/teoria/aula5', eAdmin, (req,res)=>{
		res.render('teoria/aula5')
	})
	//teoria aula 06
	app.get('/teoria/aula6', eAdmin, (req,res)=>{
		res.render('teoria/aula6')
	})
	//teoria aula 07
	app.get('/teoria/aula7', eAdmin, (req,res)=>{
		res.render('teoria/aula7')
	})
	//teoria aula 08
	app.get('/teoria/aula8', eAdmin, (req,res)=>{
		res.render('teoria/aula8')
	})
	//teoria aula 09
	app.get('/teoria/aula9', eAdmin, (req,res)=>{
		res.render('teoria/aula9')
	})
	//teoria aula 10
	app.get('/teoria/aula10', eAdmin, (req,res)=>{
		res.render('teoria/aula10')
	})



	//ROTA PERCEPÇÃO
	app.get('/percepcao', eAdmin, (req,res)=>{
		res.render('percepcao/index')
	})
	//percepcao aula 01
	app.get('/percepcao/aula1', eAdmin, (req,res)=>{
		res.render('percepcao/aula1')
	})
	//percepcao aula 02
	app.get('/percepcao/aula2', eAdmin, (req,res)=>{
		res.render('percepcao/aula2')
	})
	//percepcao aula 03
	app.get('/percepcao/aula3', eAdmin, (req,res)=>{
		res.render('percepcao/aula3')
	})
	//percepcao aula 04
	app.get('/percepcao/aula4', eAdmin, (req,res)=>{
		res.render('percepcao/aula4')
	})
	//percepcao aula 05
	app.get('/percepcao/aula5', eAdmin, (req,res)=>{
		res.render('percepcao/aula5')
	})
	//percepcao aula 06
	app.get('/percepcao/aula6', eAdmin, (req,res)=>{
		res.render('percepcao/aula6')
	})
	//percepcao aula 07
	app.get('/percepcao/aula7', eAdmin, (req,res)=>{
		res.render('percepcao/aula7')
	})
	//percepcao aula 08
	app.get('/percepcao/aula8', eAdmin, (req,res)=>{
		res.render('percepcao/aula8')
	})
	//percepcao aula 09
	app.get('/percepcao/aula9', eAdmin, (req,res)=>{
		res.render('percepcao/aula9')
	})
	//percepcao aula 10
	app.get('/percepcao/aula10', eAdmin, (req,res)=>{
		res.render('percepcao/aula10')
	})


	//ROTA TECLADO
	app.get('/teclado', eAdmin, (req,res)=>{
		res.render('teclado/index')
	})
	//teclado aula 01
	app.get('/teclado/aula1', eAdmin, (req,res)=>{
		res.render('teclado/aula1')
	})
	//teclado aula 02
	app.get('/teclado/aula2', eAdmin, (req,res)=>{
		res.render('teclado/aula2')
	})
	//teclado aula 03
	app.get('/teclado/aula3', eAdmin, (req,res)=>{
		res.render('teclado/aula3')
	})
	//teclado aula 04
	app.get('/teclado/aula4', eAdmin, (req,res)=>{
		res.render('teclado/aula4')
	})
	//teclado aula 05
	app.get('/teclado/aula5', eAdmin, (req,res)=>{
		res.render('teclado/aula5')
	})
	//teclado aula 06
	app.get('/teclado/aula6', eAdmin, (req,res)=>{
		res.render('teclado/aula6')
	})
	//teclado aula 07
	app.get('/teclado/aula7', eAdmin, (req,res)=>{
		res.render('teclado/aula7')
	})
	//teclado aula 08
	app.get('/teclado/aula8', eAdmin, (req,res)=>{
		res.render('teclado/aula8')
	})
	//teclado aula 09
	app.get('/teclado/aula9', eAdmin, (req,res)=>{
		res.render('teclado/aula9')
	})
	//teclado aula 10
	app.get('/teclado/aula10', eAdmin, (req,res)=>{
		res.render('teclado/aula10')
	})
	
	
		
	//ROTA VIOLÃO
	app.get('/violao', eAdmin, (req,res)=>{
		res.render('violao/index')
	})
	//violao aula 01
	app.get('/violao/aula1', eAdmin, (req,res)=>{
		res.render('violao/aula1')
	})
	//violao aula 02
	app.get('/violao/aula2', eAdmin, (req,res)=>{
		res.render('violao/aula2')
	})
	//violao aula 03
	app.get('/violao/aula3', eAdmin, (req,res)=>{
		res.render('violao/aula3')
	})
	//violao aula 04
	app.get('/violao/aula4', eAdmin, (req,res)=>{
		res.render('violao/aula4')
	})
	//violao aula 05
	app.get('/violao/aula5', eAdmin, (req,res)=>{
		res.render('violao/aula5')
	})
	//violao aula 06
	app.get('/violao/aula6', eAdmin, (req,res)=>{
		res.render('violao/aula6')
	})
	//violao aula 07
	app.get('/violao/aula7', eAdmin, (req,res)=>{
		res.render('violao/aula7')
	})
	//violao aula 08
	app.get('/violao/aula8', eAdmin, (req,res)=>{
		res.render('violao/aula8')
	})
	//violao aula 09
	app.get('/violao/aula9', eAdmin, (req,res)=>{
		res.render('violao/aula9')
	})
	//violao aula 10
	app.get('/violao/aula10', eAdmin, (req,res)=>{
		res.render('violao/aula10')
	})






	app.use('/admin', admin)
	app.use('/usuarios', usuarios)
// Outros
const port = process.env.PORT || 8089
app.listen(port, ()=>{
  console.log('Servidor rodando!')
})








