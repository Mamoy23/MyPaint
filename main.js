var canvas = document.getElementById('canvas');
var container = document.getElementById('container');
var ctx = canvas.getContext('2d');
var color = document.getElementById('color');
var width = document.getElementById('width');
var colorVal = document.getElementById('color').value;
var widthVal = document.getElementById('width').value;
var eraser = document.getElementById('erase');
var line = document.getElementById('line');
var pen = document.getElementById('pen');
var rect = document.getElementById('rect'); 
var mouse = {x: 0, y: 0};
var tools = document.getElementsByName('tool');
var link = document.getElementById('link');
var load = document.getElementById('load');
var redo = document.getElementById('delete');

color.oninput = function() {
    colorVal = this.value;
};

width.oninput = function() {
    widthVal = this.value;
};

eraser.onclick = function() {
    if(this.classList.contains('active'))
    this.classList.remove('active');
    else
    this.classList.add('active');
};

redo.onclick = function() {
    ctx.clearRect (0, 0, 800, 400);
}

function checkStyle(){
    if(eraser.classList.contains('active')){
        ctx.globalCompositeOperation="destination-out";
    }
    else{
        ctx.globalCompositeOperation="source-over";
        ctx.fillStyle = colorVal;
        ctx.strokeStyle = colorVal;
    }
    ctx.lineWidth = widthVal;
};

link.onclick = function() {
    link.href = canvas.toDataURL("image/png");
    link.download = "mypaint.png";
};

for(var i = 0; i < tools.length; i++){
    tools[i].addEventListener('change', function() {
        var tool = document.querySelector('input[name="tool"]:checked').value;

        canvas.onclick = null;
        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        
        switch(tool){
            case "line":
                drawLine();
                break;
            case "pen":
                drawPen();
                break;
            case "rect":
                drawRect("fill");
                break;
            case "rect2":
                drawRect("stroke");
                break;
            case "circle":
                drawCircle("fill");
                break;
            case "circle2":
                drawCircle("stroke");
        }
    });
}

function drawLine() {
    var count = 0;

    canvas.onclick = function (e){
        count++;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        checkStyle();

        if(count % 2 == 1){
            startX = mouse.x;
            startY = mouse.y;
        }
        else{
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
};

function drawPen(){
    canvas.onmousemove = function(e){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        ctx.lineJoin = 'round';
        checkStyle();
    }, false;

    canvas.onmousedown = function(){
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        canvas.addEventListener('mousemove', draw, false);
    }, false;

    canvas.onmouseup = function(){
        canvas.removeEventListener('mousemove', draw, false);
    }, false;
    
    var draw = function(){
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    };
};

function drawRect(style){
    var startX;
    var startY;
    var w;
    var h;
    var count = 0;

    canvas.onclick = function (e){
        count++;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        checkStyle();

        if(count % 2 == 1){
            startX = mouse.x;
            startY = mouse.y;
        }
        else{
            w = mouse.x - startX;
            h = mouse.y - startY;
            ctx.beginPath();
            if(style === 'fill'){
                ctx.fillRect(startX, startY, w, h);
            }
            else if(style === 'stroke'){
                ctx.strokeRect(startX, startY, w, h);
            }
            ctx.closePath();
        }
    }  
};

function drawCircle(style){
    var count = 0;

    canvas.onclick = function (e){
        count++;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        checkStyle();
        
        if(count % 2 == 1){
            startX = mouse.x;
            startY = mouse.y;
        }
        else{
            var radius = Math.sqrt(Math.pow((startX-mouse.x), 2) + Math.pow((startY-mouse.y), 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2*Math.PI);
            if(style === 'fill'){
                ctx.fill();
            }
            else if(style === 'stroke'){
                ctx.stroke();
            }
        }
    }
};

function upload(){
       var img = new Image();
        var file = document.getElementById("load").files[0];
        var url = window.URL;
        var src = url.createObjectURL(file);

    img.src = src;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        url.revokeObjectURL(src);
    }
};
load.addEventListener("change", upload, false);