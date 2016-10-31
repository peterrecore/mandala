const mandala_rings = [];



function newRing(){
	return {
        index:0,
		    rotate: 0,
        repeat: 4,
        scale: 1,
        translate: 20,
        shape: [{x:0,y:0},{x:10,y:22},{x:20,y:10}],
        spinoffset: 0
	}
}

function ringToGroup(ring) {
  var group = new paper.Group([]);

  if (ring.hasOwnProperty("shape")){
      const path = new paper.Path();
      path.strokeColor = 'black';
      for (let i=0;i < ring.shape.length;i++){
        path.add(ring.shape[i]);
      }
      path.closed=true;
      group.addChild(path);
   } else {
      group.importSVG(ring.svg);
   }
   
   group.rotate(ring.rotate);
   return group;
}

function renderRing(ring) {
   const proj = paper.projects[0];
   proj.activate();
   const layer = proj.layers[ring.index];
   layer.activate();
   layer.removeChildren();
   
   const group = ringToGroup(ring);

   group.scale(ring.scale);

   const symbol = new paper.Symbol(group);
   
   const degreesPerShape = 360 / ring.repeat;

   for (let i = 0 ; i < ring.repeat ; i++){
      const s = symbol.place({x:0,y:0});
      s.position.y -= ring.translate;
      s.rotate(degreesPerShape*i + Number(ring.spinoffset), {x:0,y:0});
   }
   layer.position = {x:250,y:250};
   proj.view.update(true);
};


function bindControls(){
       $("#ringforms").on("change", "input", handleChange);
       $("#ringforms").on("click",".btn-up, .btn-down", handleUpDownButtonPress);
}

function controlType(n, major){
  return {name:n,majorIncrement:major, minorIncrement:1}
}

function createRingForm(ring, index){
  const controlTypes=[
     controlType("rotate",20),
     controlType("translate",20),
     controlType("repeat",2),
     controlType("scale",1.5),
     controlType("spinoffset",20)];

  const wrapper = $("<div/>",{
    "id":"ring-"+index+"-wrapper",
    "class":"ring-form-wrapper"
  });

  const previewId = "ring-"+index+"-preview";
  const preview = $("<canvas/>",{
    "id":previewId + "-obsolete",
    "class":"ring-preview"
  });

  const form = $("<div/>",{
    "id":"ring-"+index+"-form",
    "class":"form-horizontal ring-form"
  });
  form.append($("<span/>",{text:"Ring " + index}));
  controlTypes.forEach( function(controlType){
     form.append(createControl(index,controlType,ring[controlType])); 
  });
  wrapper.append(form);
  wrapper.append(preview);

  $("#ringforms").append(wrapper);

  const previewProject = new paper.Project(previewId);
  previewProject.activeLayer.addChild(ringToGroup(ring));
}


function handleChange(event) {
    const ring = mandala_rings[event.target.dataset.ring];
    const controlType = event.target.dataset.controltype;
    const control = $("#" + event.target.id);
    ring[controlType] = Number(control.val());
    renderRing(ring);
}

function handleUpDownButtonPress(event) {
    var direction = event.target.dataset.dir;
    var index = event.target.dataset.ring;
    var ring = mandala_rings[index];
    var controlType = event.target.dataset.controltype;
    const majorIncrement = event.target.dataset.amount;
    var control = $("#ring-" + index + "-"+controlType);
    var currentVal = Number(control.val());
    var newVal = 0;
    if (direction === "up") {
      newVal = 0+ currentVal + Number(majorIncrement);
    }
    if (direction === "down"){
      newVal = 0+currentVal - Number(majorIncrement);
    }
    control.val(newVal);
    control.change();
}


function newDiv(c){
  return $("<div/>",{"class":c});
}

function newPlusMinusButton(index,controlType,direction){
  let btnText = "-";
  if (direction === "up"){
    btnText = "+";
  }
  const btn = $("<button/>",{
      "class":"btn btn-default btn-" + direction,
      "type":"button",
      "id":"btn-"+direction+"-" + controlType.name + "-ring-"+index,
      "data-dir":direction,
      "data-amount":controlType.majorIncrement,
      "data-ring":index,
      "data-controltype":controlType.name,
      text:btnText
  });
  return btn;
};

function createControl(index, controlType,value){
  var formGroup = newDiv("form-group");

  var label = $("<label/>",{
    "class":"col-sm-5 control-label",
    "for":"ring-"+index+"-"+controlType.name
  });
  label.html(controlType.name);


  var div = newDiv("col-sm-7");
  var input = $("<input/>",{
    "class":"form-control",
    "id":"ring-"+index+"-"+controlType.name,
    "data-ring": index,
    "data-controltype":controlType.name,
    "type":"number",
    "min":0
  });

  var inputGroup = newDiv("input-group");
  var inputGroupBtn = newDiv("input-group-btn");

  inputGroupBtn.append(newPlusMinusButton(index, controlType, "up"));
  inputGroupBtn.append(newPlusMinusButton(index, controlType, "down"));

  inputGroup.append(input);
  inputGroup.append(inputGroupBtn);
  formGroup.append(label);
  formGroup.append(div);
  div.append(inputGroup);
  input.val(value);
  return formGroup;
}

function mandalaMain(){
    const canvas = document.getElementById('myCanvas');

    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    // read rings from source
    const ring1 = newRing();
    mandala_rings.push(ring1);
    const layer1 = new paper.Layer();



    const ring2 = newRing();
    ring2.shape =[{x:0,y:0},{x:0,y:30},{x:15,y:20},{x:10,y:0}]
    ring2.index = 1;
    
    mandala_rings.push(ring2);
    const layer2 = new paper.Layer();

    var ring3 = newRing();
    ring3.index = 2;
    ring3.translate = 50;
    delete ring3.shape;
    ring3.svg = '<svg xmlns="http://www.w3.org/2000/svg" id="sampleSVG"><path fill="red" d="M4,14h20v-2H4V14z M15,26h7v-2h-7V26z M15,22h9v-2h-9V22z M15,18h9v-2h-9V18z M4,26h9V16H4V26z M28,10V6H0v22c0,0,0,4,4,4 h25c0,0,3-0.062,3-4V10H28z M4,30c-2,0-2-2-2-2V8h24v20c0,0.921,0.284,1.558,0.676,2H4z"/></svg>';

    const layer3 = new paper.Layer();

    mandala_rings.push(ring3);

    // render each ring
    mandala_rings.forEach(renderRing);

    mandala_rings.forEach(createRingForm);

    bindControls();
    
    var app = new Vue({
      el: '#app',
      data: {
        rings: mandala_rings
      }
    })

}