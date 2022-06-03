var theme = "light";

if(theme === "light"){
    document.querySelector(":root").style.setProperty("--bg", "#fff");
    document.querySelector(":root").style.setProperty("--bg_2", "#f3f3f3");
}
if(theme === "dark"){
    document.querySelector(":root").style.setProperty("--bg", "#3c3c3c");
    document.querySelector(":root").style.setProperty("--bg_2", "#2c2c2c");
}

var functions = [
    {
        name: "print",
        params: ["a"],
        param_names: ["text"],
        inputs_needed: 1
    }, {
        name: "rect",
        params: ["n","n","n","n"],
        param_names: ["x1","y1","x2","y2"],
        inputs_needed: 4
    }, {
        name: "coordinateMode",
        params: [["GRAPH/t","CENTER/t","NORMAL/t"]],
        param_names: ["GRAPH/CENTER/NORMAL"],
        inputs_needed: 1
    }
];

var function_names = [];
for(let i = 0; i < functions.length; i++){
    function_names.push(functions[i].name);
}

var full_param_names = [["n","s","b"], ["number","string","boolean"]];

var fullParameterName = function(shortened){
    return full_param_names[1][full_param_names[0].indexOf(shortened)];
}

var isNumeric = function(input){
    return !isNaN(Number(input));
}

var drawJSFunction = function(name, params){
    //Error Check
    {
    var has_an_error = false;
    var function_data = functions[function_names.indexOf(name)];
    if(params.length < function_data.inputs_needed){
        console.error("Not enough inputs given! Remember the syntax for the \'" + name + "\' function is " + name + "(" + function_data.param_names.join(", ") + ")");
        has_an_error = true;
    }
    if(params.length > function_data.inputs_needed){
        let plural = "";
        if(function_data.inputs_needed !== 1){
            plural = "s";
        }
        if(function_data.inputs_needed === function_data.params.length){
            console.error("The \'" + name + "\' function only needs " + function_data.inputs_needed + " input" + plural + "!");
            has_an_error = true;
        } else {
            console.error("The \'" + name + "\' function only needs up to " + function_data.inputs_needed + " input" + plural + "!");
            has_an_error = true;
        }
    }
    if(params.length === function_data.inputs_needed){
        for(let i = 0; i < function_data.params.length; i++){
            var param_type = typeof(params[i]);
            var cur_param = function_data.params[i];
            if(cur_param !== "a" && !(cur_param === "n" && param_type === "number") && !(cur_param === "s" && param_type === "string") && !(cur_param === "b" && param_type === "boolean")){
                let number_ending = "th";
                if((i + 1) % 10 === 1 && (i + 1) !== 11){
                    number_ending = "st";
                }
                if((i + 1) % 10 === 2 && (i + 1) !== 12){
                    number_ending = "nd";
                }
                if((i + 1) % 10 === 3 && (i + 1) !== 13){
                    number_ending = "rd";
                }
                console.error("The " + (i + 1) + number_ending + " parameter, \'" + function_data.param_names[i] + "\', should be a " + fullParameterName(cur_param) + ", not a " + param_type + "!");
                has_an_error = true;
            }
        }
    }
    }
    if(has_an_error === false){
        var engine = document.getElementById("engine_canvas");
        var ctx = engine.getContext("2d");
        if(name === "print"){
            console.log(params[0]);
        }
        if(name === "rect"){
            ctx.fillRect(params[0], params[1], params[2], params[3]);
        }
    }
}

var updateNumbers = function(){
    var numbers = document.getElementById("numbers");
    numbered_list = "";
    for(let i = 0; i < code.value.split("\n").length; i++){
        if(i === code.value.split("\n").length){
            numbered_list += (i + 1).toString();
        } else {
            numbered_list += (i + 1).toString() + "\n";
        }
    }
    numbers.value = numbered_list;
};

var run = function(){
    var code = document.getElementById("code").value.replaceAll("\n", "").replaceAll(" ", ""); //Fix spacing in strings

    var declarations = [];
    let j = 0;
    while(code[j] !== undefined && declarations.length < code.split(";").length - 1){
        let temp_str = "";
        while(code[j] !== ";" && code[j] !== undefined){
            temp_str += code[j];
            j++;
        }
        temp_str = temp_str.replaceAll(")","").split("(");
        temp_str[1] = temp_str[1].split(",");
        if(temp_str[1].length === 1 && temp_str[1][0] === ""){
            temp_str[1] = [];
        }
        for(let k = 0; k < temp_str[1].length; k++){
            if(isNumeric(temp_str[1][k])){
                temp_str[1][k] = Number(temp_str[1][k]);
            }
            if(temp_str[1][k] === "true"){
                temp_str[1][k] = true;
            }
            if(temp_str[1][k] === "false"){
                temp_str[1][k] = false;
            }
        }

        declarations.push(temp_str);
        j++;
    }

    for(let i = 0; i < declarations.length; i++){
        if(function_names.includes(declarations[i][0])){
            drawJSFunction(declarations[i][0], declarations[i][1]);
        } else {
            console.error("The function \'" + declarations[i][0] + "\' is not defined.");
        }
    }
};

var codeChange = function(){
    updateNumbers();
    run();
};

window.onload = function(){
    let engine =  document.getElementById("engine_canvas");
    let vw = document.documentElement.clientWidth;
    engine.width = vw * 0.36;
    engine.height = vw * 0.36;
    engine.style.width = vw * 0.36;
    engine.style.height = vw * 0.36;

    codeChange();
    document.getElementById("code").oninput = function(){
        codeChange();
    };

    console.log();
}

/*
    ADDED:
    print()

    NEW:
    canvas.width, canvas.height, window.width, window.height, loop(){}, repeat(amount){}, rect(x1, y1, x2, y2), ellipse(x, y, w, h), triangle(x1, y1, x2, y2, x3, y3), polygon(x1, y1, x2, y2, x3, y3...), wait(seconds){}, mouseX, mouseY, mouseIn, mouseOut, fill(color), fillGradient(color1, color2, gradientMode), restart()
*/