module.exports = {
	entry: './app/main.js',
	output: {
		path: './',
		filename: 'index.js'
	},
	devServer: {
		inline: true,
		host: "0.0.0.0",
		port: 8020
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'react-hot!babel'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query:{
				presets : ['es2015', 'react']
				}
			},
			{
				test: /\.html$/,
				loader: "file?name=[name].[ext]",
			},
			{
				test: /\.css$/, 
				loader: "style-loader!css-loader" 
			},
			{
				test: /\.less$/,
				use: [
				'style-loader',
				{ loader: 'css-loader', options: { importLoaders: 1 } },
				'less-loader'
				]
			},
			{ 
				test: /\.png$/, 
				loader: "url-loader?limit=100000" 
			},
			{ 
				test: /\.jpg$/, 
				loader: "file-loader" 
			}
		]
	}
}