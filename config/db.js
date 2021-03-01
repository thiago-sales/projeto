if(process.env.NODE_ENV == 'production'){
	module.exports = {mongoURI: 'mongodb+srv://thiago:piano2021@cluster0.om4ud.mongodb.net/<dbname>?retryWrites=true&w=majority'}
}else{
	module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}

