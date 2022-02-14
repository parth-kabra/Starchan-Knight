const platform = "https://raw.githubusercontent.com/parth-kabra/Starchan-Knight/main/img/platform.png"
const background = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/background.png?raw=true"
const hills = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/hills.png?raw=true"
const platformSmallTall = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/platformSmallTall.png?raw=true"
const spriteRunLeft = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/spriteRunLeft.png?raw=true"
const spriteRunRight = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/spriteRunRight.png?raw=true"
const spriteStandLeft = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/spriteStandLeft.png?raw=true"
const spriteStandRight = "https://github.com/parth-kabra/Starchan-Knight/blob/main/img/spriteStandRight.png?raw=true"
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const score = document.querySelector('#score')
let pts = 0
canvas.width = 1024
canvas.height = 576

const gravity = 1.5


class Player{
	
	constructor(){
		this.speed = 10
		this.position = {
			x : 100,
			y : 100
		}
		
		this.velocity = {
			x : 0,
			y : 0
		}

		this.width = 66
		this.height = 150
		this.frames = 0
		this.image = createImage(spriteStandRight)
		this.sprites = {
			stand: {
				left: createImage(spriteStandLeft),
				right: createImage(spriteStandRight),
			},
			run: {
				left: createImage(spriteRunLeft),
				right: createImage(spriteRunRight),
			},
		}
		this.currentSprite = this.sprites.stand.right
		this.currentCropWidth = 177
	}
		
	draw(){
		c.drawImage(
			this.currentSprite,
			this.currentCropWidth* this.frames,
			0,
			this.currentCropWidth,
			400,
			this.position.x, 
			this.position.y, 
			this.width, 
			this.height
		)
	}
	
	update(){
		this.frames++
		if(this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)){
			this.frames = 0
		}
		else if(this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)){
			this.frames = 0
		}

		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		if(this.position.y + this.height + this.velocity.y <= canvas.height)
			this.velocity.y += gravity
	}
	
};

class Platform{
	constructor({x,y,image}){
		this.position = {
			x,
			y
		}
		this.image = image
		this.width = image.width
		this.height = image.height
		
	}	
	draw(){
		c.drawImage(this.image, this.position.x, this.position.y)
	}
};

class GenericObject{
	constructor({x,y,image}){
		this.position = {
			x,
			y
		}
		this.image = image
		this.width = image.width
		this.height = image.height
		
	}	
	draw(){
		c.drawImage(
			this.image, 
			this.position.x, 
			this.position.y
		)
	}
};

function createImage(imageSrc){
	const image = new Image()
	image.src = imageSrc
	return image
}

let platformSmallTallImage = createImage(platformSmallTall)
let platformImage = createImage(platform)
let player = new Player()
let platforms = []

let genericObjects = []
let scrolloffset = 0
function init(){
	pts = 0;
	score.innerHTML = pts
	platformImage = createImage(platform)
	player = new Player()
	platforms = [
		new Platform({x : platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, y : 270,image: createImage(platformSmallTall)}),
		new Platform({x : -1, y : 470,image : platformImage}), 
		new Platform(({x:platformImage.width-3,y:470,image : platformImage})),
		new Platform({x : platformImage.width * 2 + 100, y : 470,image : platformImage}),
		new Platform({x : platformImage.width * 3 + 300, y : 470,image : platformImage}),
		new Platform({x : platformImage.width * 4 + 300 - 2, y : 470,image : platformImage}),
		new Platform({x : platformImage.width * 5 + 700 - 2, y : 470,image : platformImage}),
	]

	genericObjects = [
		new GenericObject({
			x:-1, y:-1, image : createImage(background)
		}),
		new GenericObject({
			x : - 1,
			y:-1,
			image : createImage(hills)
		})
	]
	scrolloffset = 0
}
const keys = {
	right : {
		pressed : false
	},
	left : {
		pressed : false
	},
	down : {
		pressed : false
	},
	up : {
		pressed : false
	}
}

function animate(){
	requestAnimationFrame(animate)
	c.fillStyle = "white"
	c.fillRect(0,0,canvas.width, canvas.height)

	genericObjects.forEach((genericObject) => {
		genericObject.draw()
	})

	platforms.forEach((platform) => {
		platform.draw()	
	})
	player.update()
	if(keys.right.pressed && player.position.x < 400){
		player.velocity.x = player.speed;
	}
	else if((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrolloffset === 0 && player.position.x > 0){
		player.velocity.x = -player.speed
	}
	else{
		player.velocity.x = 0
		if(keys.right.pressed){
			scrolloffset += player.speed
			platforms.forEach((platform) => {
				
				platform.position.x -= player.speed
			})
			genericObjects.forEach(genericObject =>{
				genericObject.position.x -= player.speed * .66
			})
		}
		else if(keys.left.pressed && scrolloffset > 0){
			scrolloffset -= player.speed
			platforms.forEach((platform) => {
				
				platform.position.x += 5;
			})
			genericObjects.forEach(genericObject => {
				genericObject.position.x += player.speed *.66
			})
		}
	}
	
	// colision detection
	platforms.forEach((platform) => {
		
		if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
			player.velocity.y = 0;
		}
	})

	if(keys.right.pressed){
		pts += 10;
		score.innerHTML = pts
	}

	if(scrolloffset > platformImage.width * 5 + 700 - 2){
		console.log("win")
	}

	if(player.position.y > canvas.height){
		init()
	}
}
init()
animate()

addEventListener('keydown', ({keyCode}) => {
	switch(keyCode) {
		case 65:
			console.log("left")
			keys.left.pressed = true
			player.currentSprite = player.sprites.run.left
			player.currentCropWidth = 341
			player.width = 127.875
			break;
		
		case 68:
			console.log("right")
			keys.right.pressed = true
			player.currentSprite = player.sprites.run.right
			player.currentCropWidth = 341
			player.width = 127.875
			break	
		
		case 83:
			console.log("down")
			keys.down.pressed = true
			break
			
		case 87:
			console.log("up")
			keys.up.pressed = true
			player.velocity.y -= 25
			break
	}
})

addEventListener('keyup', ({keyCode}) => {
	switch(keyCode) {
		case 65:
			console.log("left")
			player.velocity.x = 0
			keys.left.pressed =false
			player.currentSprite = player.sprites.stand.left
			player.currentCropWidth = 177
			player.width = 66
			break;
		
		case 68:
			console.log("right")
			player.velocity.x =0
			keys.right.pressed = false
			player.currentSprite = player.sprites.stand.right
			player.currentCropWidth = 177
			player.width = 66
			break	
		
		case 83:
			console.log("down")
			keys.down.pressed = false
			break
			
		case 87:
			console.log("up")
			player.velocity.y =0
			keys.up.pressed = false
			break
	}
})