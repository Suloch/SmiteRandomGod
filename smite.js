
class RandomSelector{

    offsets = {
        4060: {x: 950, y: 0, scale: 4000},
        3954: {x: 170, y: 0, scale: 1600},
        3990: {x: 170, y: 0, scale: 1600},
        4191: {x: 200, y: 0, scale: 1600},
        1747: {x: 0, y: 0, scale: 1600},
        4039: {x: 240, y: 0, scale: 1600},
        4006: {x: 180, y: 0, scale: 1600},
        3881: {x: 240, y: 60, scale: 1600},
        4183: {x: 180, y: 0, scale: 1600},
        4213: {x: 220, y: 0, scale: 1600},
        4075: {x: 220, y: 0, scale: 1600},
        4242: {x: 220, y: 0, scale: 1600},
        4137: {x: 220, y: 0, scale: 1600},
        3997: {x: 180, y: 0, scale: 1600},
        3984: {x: 180, y: 0, scale: 1600},
        3945: {x: 180, y: 0, scale: 1600},
        4017: {x: 180, y: 0, scale: 1600},
        4010: {x: 180, y: 0, scale: 1600},
        4268: {x: 220, y: 0, scale: 1600},
        1921: {x: 250, y: 0, scale: 2400},
        4034: {x: 250, y: 0, scale: 1600},
        
        
    }

    getOffsets(godId){
        let offset = {};
        if(godId in this.offsets)
            offset = this.offsets[godId]
        else
            offset = {x: 0, y: 0, scale: 1200}

        return {x: offset.x, y: offset.y, scale: offset.scale/this.canvas.width};        
    }

    constructor(){
        this.canvas = document.getElementById("main");
        this.ctx = this.canvas.getContext("2d");

        this.gods = [];
        
        this.allowedClasses = {
            "Assassin": document.getElementById("Assassin").checked,
            "Hunter": document.getElementById("Hunter").checked,
            "Guardian": document.getElementById("Guardian").checked,
            "Mage": document.getElementById("Mage").checked,
            "Warrior": document.getElementById("Warrior").checked,
        }

        this.running = false;
        this.length = 8;
        this.start = -1;
        this.end = this.gods.length;

        this.speed = 0;
        this.acceleration = -0.02;
        this.selected = -2;
        
        this.widthToHeightRatio = 3.9;

        this.initImages();
        this.updateGodList();
        this.updateDimensions();
        

    }

    updateGodList(){
        this.gods = [];
        for(let god of gods){
        
            if(this.allowedClasses[god.role_EN])
                this.gods.push(god);
        }
        this.end = this.gods.length;
        this.start = -1;
    }

    updateDimensions(){
        this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        this.canvas.width = 0.5 * this.vw;
        this.canvas.height = this.canvas.width / this.widthToHeightRatio;

        this.boxPaddingHorizontal = 0.0125 * this.canvas.width;
        this.boxWidth = 0.15 * this.canvas.width;
        
        this.boxHeight = 0.8 * this.canvas.height;
        this.boxPaddingVertical = 0.1 * this.canvas.height;
        
        if(!this.running)
            this.offset = -1.5 * this.boxWidth ;

        this.drawBoxes();
        this.updateSettingsDiv();
    }

    updateSettingsDiv(){
        let element = document.getElementById("settings");
        element.style.width = this.canvas.width + 'px';
        element.style.marginLeft = (this.canvas.width / 2 ) + 'px';

    }
    initImages(){
        for(let god of gods){
            let img = document.createElement('img');
            img.src = god.card;
            god.img = img; 
        }
        this.selectedBorderImage = document.createElement('img');
        this.selectedBorderImage.src = 'assets/7.png';

    }

    drawBoxes(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(var i = 0; i < this.length; i++){
            this.drawBox(this.offset+i*(this.boxPaddingHorizontal+this.boxWidth), this.boxPaddingVertical, this.boxWidth, this.boxHeight, this.start+i);
        }
        this.drawMainFrame(false);
    }

    drawBox(startx, starty, width, height, imageIndex){
        if (imageIndex < 0){
            imageIndex = this.end + imageIndex;
        }
        // this.ctx.beginPath();
        // this.ctx.rect(startx, starty, width, height);
        // this.ctx.stroke();
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(startx, starty);
            this.ctx.lineTo(startx, height);
            this.ctx.lineTo(startx+width*0.15, height*1.12);
            this.ctx.lineTo(startx+width-width*0.15, height*1.12);

            this.ctx.lineTo(startx+width, height);
            this.ctx.lineTo(startx+width, starty);
            this.ctx.lineTo(startx, starty);

            this.ctx.stroke();
            this.ctx.clip();
        try{
            let offsets = this.getOffsets(this.gods[imageIndex].id)
            this.ctx.drawImage(this.gods[imageIndex].img, offsets.x, offsets.y, width*offsets.scale, height*offsets.scale, startx, starty, width, height);
        }catch(e){
            console.error(e);
        }
        this.ctx.restore();
    }

    showGenerated(){
        let generated = this.start + 3;
        if(generated < 0)
            generated = this.end + generated;
        menu.selected = generated;
        this.drawMainFrame(true);

    }

    drawMainFrame(lastFrame){
        let height = this.canvas.height*0.95;
        let width = this.boxWidth * 1.05;
        let yOffset = 1;
        this.ctx.drawImage(this.selectedBorderImage, this.canvas.width*0.5-width/2-this.boxPaddingHorizontal, yOffset, width, height);

        if(lastFrame){
            this.ctx.beginPath();
    
            this.ctx.moveTo(this.canvas.width*0.5-width*0.12, height*0.93);
            this.ctx.lineTo(this.canvas.width*0.5-width*0.075, height*0.91);
            this.ctx.lineTo(this.canvas.width*0.5-width*0.04, height*0.93);
            this.ctx.lineTo(this.canvas.width*0.5-width*0.075, height*0.99);
            this.ctx.lineTo(this.canvas.width*0.5-width*0.12, height*0.93);
            this.ctx.fillStyle =  "red";
    
            this.ctx.fill();
        }


        this.ctx.font = "18px Georgia";
        this.ctx.fillStyle = "white";
        let generated = this.start + 3;
        if(generated < 0)
            generated = this.end + generated;
        this.ctx.textAlign = "center"; 
        this.ctx.fillText(this.gods[generated].name, this.canvas.width*0.5-this.boxPaddingHorizontal, height*0.1);
        
        

    }   
    
}



function animate(menu){
    
    menu.running = true;
    menu.selected = -1;

    function update(){
        menu.offset += 1 * menu.speed;
        menu.speed += menu.acceleration;
        
        menu.drawBoxes();

        if(menu.speed < 1){
            menu.running = false;
            menu.speed = 1
        }
        if(menu.offset >= -0.5*menu.boxWidth){
            if(!menu.running){
                menu.showGenerated();
                return;
            }

            menu.offset = -(menu.boxPaddingHorizontal + 1.5*menu.boxWidth);
            
            menu.start--;
            if(menu.start == 1 - menu.end){
                menu.start = 0;
            }
        }
        
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}


let menu = new RandomSelector();

addEventListener("resize", (event)=>{
    menu.updateDimensions();
    
});

function updateClasses(input){
    if(menu.selected == -1)
        return
    else
        menu.allowedClasses[input.id] = input.checked

    menu.updateGodList();
    menu.drawBoxes();
}

function generate(){
    if(menu.selected == -1)
        return

    menu.updateGodList();
    menu.start = Math.floor(Math.random()*menu.gods.length); 
    // menu.speed = 1;
    menu.speed = 20+Math.random()*5;

    animate(menu);
}

function updateBlackList(abs){
    console.log(document.getElementById("bi"));

    console.log(abs)
}


menu.updateGodList()
