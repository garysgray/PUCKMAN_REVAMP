function map(aScreenWidth,aScreenHeight,aCellWidth,aCellHeight,rows,colums)
{
	//aSprite = the sPrite that is going to be the main image for the game boarder
	//numRows is the max amount of cells on X.  Y eventually with have numCol 
	this.numRows = rows;
	this.numCols = colums;
	
	//for grid/puzzle sprites on map
	this.cellWidth = aCellWidth;
	this.cellheight = aCellHeight;
	this.numGridX = 0;
	this.numGridY = 0;
	this.skip = 0;
	this.gap  = 0;
	this.offSet = 0;
	this.screenWidth = aScreenWidth;
	this.screenHeight = aScreenHeight;
	
	this.numOfGoals = 0;
	this.numOfEnemies = 0;
	

    this.setBoarder =  function(aSprite,aWidth,aHeight,spriteHldr)
    {
            
        for(var i = 0;i< this.numRows;i++)
        {
            ///top and bottom
            var aBrick = new sprite(aSprite.image.src,aSprite.width,aSprite.height,i * aSprite.width,0);
            spriteHldr.addSprite(aBrick);

            var aBrick = new sprite(aSprite.image.src,aSprite.width,aSprite.height,i * aSprite.width,aHeight-aSprite.height);
            spriteHldr.addSprite(aBrick);
            
        }
        for(var i = 0;i< this.numCols;i++)
        {	
            //left and right	
            var aBrick = new sprite(aSprite.image.src,aSprite.width,aSprite.height,0,i * aSprite.height);
            spriteHldr.addSprite(aBrick);
        
            var aBrick = new sprite(aSprite.image.src,aSprite.width,aSprite.height,aWidth-aSprite.width,i * aSprite.height);
            spriteHldr.addSprite(aBrick);
        }
        //this is a sneaky way of getting number of boarder tiles that i want to start ccunting grid tiles for 
        //diffeent collision FIX FIX  
        this.setBoarderTilesNum(spriteHldr);
    }



    this.drawBoarder = function(aDev,aSprtHldr)
    {
        aDev.ctx.fillStyle = '#000';
        aDev.ctx.fillRect(0, 0, this.screenWidth, screenHeight);

        for(var i = 0;i< aSprtHldr.numOfBoarderTiles;i++)
        {	
            aSprtHldr.sprites[i].draw(aDev);
        }
    }

    this.setBoarderTilesNum= function(spriteHldr)
    {
        spriteHldr.numOfBoarderTiles = (this.numRows * 2) + (this.numCols * 2);
    }

    this.setGrid = function(aSprite,grid,spriteHldr)
	{
		this.gap  = grid.gaps;
		this.skip = grid.skip;
		this.numGridX = grid.rows;
		this.numGridY = grid.rows;//temp
		//this makes gridBuff value that we use when placing grid on map in render() functions
		//will eventually be a init function for a grid object
		this.offSet  = this.gap * this.cellWidth;	
			
		for(var i =0; i< this.numGridX;i+= this.skip)
		{	
			for(j = 0;j< this.numGridY;j+= this.skip)
			{
				//dev.ctx.drawImage(this.sprite.image,this.offSet+(i*this.sprite.width),this.offSet+(j* this.sprite.height));
				var aBrick = new sprite(aSprite.image.src, aSprite.width, aSprite.height, this.offSet + (i * aSprite.width), this.offSet + (j * aSprite.height));
				 aBrick.type = "brick";
				spriteHldr.addSprite(aBrick);
			}
		}
	}

}

////goes in game
//grids are set of values that help set the maps grid
var grids = new Array();

//make 5 grid pattern value holders "grids"
var grid1 = new grid(8,8,16);
var grid2 = new grid(6,6,16);
var grid3 = new grid(6,4,16);
var grid4 = new grid(8,4,10);
var grid5 = new grid(5,3,16);

//stuff the grid array
grids =[grid1,grid2,grid3,grid4,grid5];


//simple struct really, hold values for making map grids
function grid(num1,num2,num3)
{
	this.gaps = num1;
	this.skip = num2;
	this.rows = num3;
}
