function jsmandelbrot() {
    if (document.getElementById("capture").getContext) {
        var 
            params = {
                h:1024,
                v:1024,
                iterm:1000,
                
                degree:9,
                
                amin:-2,    amax:1,
                bmin:-1.5,  bmax:1.5
            };

        function z_0() {
            return { a:0, b:0 };
            //return { a:-0.8, b:0.156 };
        }
        
        function z_n(z, c) {
            return { 
                a:z.a * z.a - (z.b * z.b) + c.a,
                b:2 * z.a * z.b + c.b
            };
        }
        
        function z_abs(z) {
            return Math.sqrt(z.a * z.a + z.b * z.b);
        }
        
        function color(iter) {
            if (iter == params.iterm) {
                return "black";
            }
            
            var rval = Math.floor(3000 * iter / params.iterm) % 255;
            var gval = Math.floor(300 * iter / params.iterm) % 255;
            
            return "rgb(" + rval + "," + gval + ",40)"
        }
        
        function render() {
            capturing = false;
            document.getElementById("msg").innerHTML = "Working...";
            
            document.getElementById("coord").innerHTML = "x-min:" + params.amin + "<br/>x-max:" + params.amax + "<br/>y-min:" + params.bmax + "<br/>y-max:" + params.bmin;
            
            var 
                div = 2,                
                ctx = document
                    .getElementById("mandelbrot")
                    .getContext("2d"),
                ascale = params.amax - params.amin,
                bscale = params.bmax - params.bmin;
        
            var ci = setInterval(
                function() {
                    
                    for (var hi = 0; hi < div; ++hi) {
                        for (var vi = 0; vi < div; ++vi) {
                            
                            var 
                                z = z_0(),
                                
                                c = {
                                    a:((ascale * hi) / div) + params.amin,
                                    b:((bscale * vi) / div) + params.bmin
                                };
                            
                            for (var iter = 0;; iter++) {
                                z = z_n(z, c);
                                
                                if (z_abs(z) > 2 || iter >= params.iterm) {
                                    
                                    ctx.fillStyle = color(iter);
                                    
                                    ctx.fillRect(
                                        Math.floor((hi * params.h) / div),
                                        Math.floor((vi * params.v) / div),
                                        Math.floor(params.h / div),
                                        Math.floor(params.v / div)
                                    );
                                    
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (div == Math.pow(2, params.degree)) {
                        clearInterval(ci);
                        document.getElementById("msg").innerHTML = "Done";
                        capturing = true;
                    }
                    
                    else {
                        div *= 2;
                    }
                }, 
                10
            );
        }   

        var capture = document.getElementById("capture").getContext("2d");
        
        capture.strokeStyle = "rgb(255,255,255)";
        capture.lineWidth = 4;
        
        var capturing = false;
        
        window.onmousemove = function(e) {                
            capture.clearRect(0, 0, params.h, params.v);
            
            if (capturing) {
                
                var 
                    xpos = (e.clientX) * (1024 / document.body.clientWidth) - 256,
                    ypos = (e.clientY) * (1024 / document.body.clientHeight) - 256;
                
                if (xpos < 0) xpos = 0;
                if (xpos > 512) xpos = 512;
                
                if (ypos < 0) ypos = 0;
                if (ypos > 512) ypos = 512;
                
                capture.strokeRect(
                    xpos,
                    ypos,
                    512,
                    512
                );
                
            }
        };
        
        window.onmousedown = function(e) {
            if (capturing) {
                var 
                    xpos = (e.clientX) * (1024 / document.body.clientWidth) - 256,
                    ypos = (e.clientY) * (1024 / document.body.clientHeight) - 256;
                    
                if (xpos < 0) xpos = 0;
                if (xpos > 512) xpos = 512;
                
                if (ypos < 0) ypos = 0;
                if (ypos > 512) ypos = 512;
                
                var 
                    ascale = params.amax - params.amin,
                    bscale = params.bmax - params.bmin,
                    namin = (xpos / params.h) * ascale + params.amin,
                    namax = ((xpos + 512) / params.h) * ascale + params.amin,
                    nbmin = (ypos / params.v) * bscale + params.bmin,
                    nbmax = ((ypos + 512) / params.v) * bscale + params.bmin;

                params.amin = namin;
                params.amax = namax;
                params.bmin = nbmin;
                params.bmax = nbmax;
                
                render();
            }
        };
        
        render();
    }
}