/**
 * 
 * Component that renders a circular feature viewer. It displays annotations over a particular sequence, in a circular fasion. It can be used with circular genomes such as the mothocondia, but also with proteins.  
 * 
 * @class
 * @extends Biojs
 * 
 * @author <a href="mailto:villaveces@biochem.mpg.de">José Villaveces</a>
 * @version 1.0.0_beta
 * @category 2
 * 
 * @requires <a href='http://d3js.org/'>D3 Data-Driven Documents</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.1/d3.min.js"></script>
 *
 * @requires <a href='http://underscorejs.org/'>underscore.js</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
 * 
 * @param {Object} options An object with the options for this component.
 *    
 * @option {string} target 
 *    id of the div where the component should be displayed.
 * 
 * @option {string} sequence
 * 	  The sequence to be annotated.
 * 
 * @option {int} width
 * 	  desired width of the component.
 *
 * @option {int} height
 * 	  desired height of the component.
 *
 *
 * @option {Object[]} features
 * 	  Array containing the annotations.
 *
 * @option {int} id
 * 	  Annotation identifier.
 *
 * @option {int} start
 * 	  Position at wich the annotation starts.
 *
 * @option {int} stop
 * 	  Position at wich the annotation terminates.
 *
 * @option {string[] || string} type
 * 	  Annotation type, annotation color is decided uppon the annotation type
 *
 * @example
 * var myCircularFeatureViewer = new Biojs.CircularFeatureViewer({
 *      target: 'YourOwnDivId',
 *		sequence:'MTAVFRVGLVRLVSRATQSPNLLQAQTNALPAAFQQRCSISGKTMRGGPRVPKAAPYPYKTKKYSVFNAIFDKTSKRFDENSKVICVEGPIAAGKSKFAKELAEELDMEYYPAVDLDLIYINSYGYDMRKLDPQLPPSCRSYDVRNFCLDPSHDLAAQFQIRMYMLRYSQYIDALQHVLSTGQGVVLERSPYSDFVFMEAMFRQGYLSRGARSVYNELRQNTIGELLKPHLVIYLDLPVDAVKKQIKARNVDYEVQSKVFSDAYLSDLEQLYKQQYLKDISTHAELLIYDWTAGGETEVVVEDIERIDFNQFEADIHNKKMLDWRFPLEAEWCEARIKYCHEKPDLMNYFNVPRFDVPELVRSADDGKVWRDVWFNAPGMKYRPGYNADMGDEGLLTKTKIGINQGI',
 *      features:[
 *          { "id": 0, "start": 19, "stop": 305, "type": "voluptate", "color":"green" },
 *          { "id": 1, "start": 143, "stop": 283, "type": "non", "color":"red"},
 *          { "id": 2, "start": 76, "stop": 238, "type": "voluptate", "color":"blue" }, 
 *          { "id": 3, "start": 355, "stop": 12, "type": "sit" }, 
 *          { "id": 4, "start": 125, "stop": 206, "type": "et" }, 
 *          { "id": 5, "start": 253, "stop": 136, "type": "proident" }
 *      ],
 *      width:715,
 *      height:505
 * });
 */
var Class = require('js-class');
var _ = require("underscore");

module.exports = CircularFeatureViewer = Class(
/** @lends Biojs.CircularFeatureViewer# */
{
    constructor: function (options) {
      this._render();
    },

    _render: function (options) {
        this._organizeTracks();
        this._initVariables();
        this._updateView(this.opt.features);
    },

    /**
	 * Default values for the options
	 * @name Biojs.CircularFeatureViewer-opt
	 */
    opt: {
        target: 'YourOwnDivId',
        sequence: '',
        features: [],
        width:500,
        height:500
    },

    eventTypes: [
        /**
		 * @name Biojs.CircularFeatureViewer#annotationMouseover
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {Object} target annotation.
		 * @example 
		 * myCircularFeatureViewer.annotationMouseover(
		 *    function( objEvent ) {
		 *       alert("Annotation: " + objEvent.start + ", " + objEvent.stop );
		 *    }
		 * );
		 * 
		 * */
        'annotationMouseover',
        /**
		 * @name Biojs.CircularFeatureViewer#annotationMouseout
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {Object} target annotation.
		 * @example 
		 * myCircularFeatureViewer.annotationMouseout(
		 *    function( objEvent ) {
		 *       alert("Annotation: " + objEvent.start + ", " + objEvent.stop );
		 *    }
		 * );
		 * 
		 * */
        'annotationMouseout',
        /**
		 * @name Biojs.CircularFeatureViewer#annotationClick
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {Object} target annotation.
		 * @example 
		 * myCircularFeatureViewer.annotationClick(
		 *    function( objEvent ) {
		 *       alert("Annotation: " + objEvent.start + ", " + objEvent.stop );
		 *    }
		 * );
		 * 
		 * */
        'annotationClick',
        /**
		 * @name Biojs.CircularFeatureViewer#annotationAdded
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {Object} target annotation.
		 * @example 
		 * myCircularFeatureViewer.annotationAdded(
		 *    function( objEvent ) {
		 *       alert("Annotation: " + objEvent.start + ", " + objEvent.stop );
		 *    }
		 * );
		 * 
		 * */
        'annotationAdded',
        /**
		 * @name Biojs.CircularFeatureViewer#annotationRemoved
		 * @event
		 * @param {function} actionPerformed An function which receives an {@link Biojs.Event} object as argument.
		 * @eventData {Object} source The component which did triggered the event.
		 * @eventData {string} type The name of the event.
		 * @eventData {Object} target annotation.
		 * @example 
		 * myCircularFeatureViewer.annotationRemoved(
		 *    function( objEvent ) {
		 *       alert("Annotation: " + objEvent.start + ", " + objEvent.stop );
		 *    }
		 * );
		 * 
		 * */
        'annotationRemoved'
    ],
    // internal members
    _tracks : [], // Array of annotation tracks
    _svg : null, // The svg tag where the component is render
    _colorScale : d3.scale.category20c(), // Color scale
    _arc : null, // Object to create semi circles from data
    _seqToRad : null, // Translates a sequence position to radians
    _seqToDeg : null, // Translates a sequence position to degrees
    _lineFunction : null, // Object to create lines
    _radius : null, // circle radius
    _rotate : false,
    _numInParenthesis : /\((-?\d+(\.\d{1,100})?)\)/,
    
    /**
	 * Rotates all annotations so the desired sequence position is at 12 o'çlock.
	 * @param {int} pos The sequence position.
	 * 
	 * @example 
	 * myCircularFeatureViewer.goTo(66);
     *
     * @example 
	 * myCircularFeatureViewer.goTo(1);
	 * 
	 */
    goTo : function(pos){
        if(pos > 0 && pos <= this.opt.sequence.length){
            
            this._svg.selectAll('.main').transition().attr("transform", "translate(" + this.opt.width / 2 + "," + 
                                                this.opt.height / 2 + ")"+"rotate("+ -this._seqToDeg(pos)+")")
                                          .duration(1500) // this is 1s
                                          .delay(100)// this is 0.1s;
                                          .ease("linear");
            
            this._svg.selectAll('.txt').transition().text(this._getSequenceChunk(pos, 10));
        }
    },
    /**
	 * Adds a new annotation.
	 * @param {Object} annotation The annotation.
	 * 
	 * @example 
	 * myCircularFeatureViewer.addAnnotation({ "id": 14, "start": 351, "stop": 190, "type": "dolore" });
	 * 
	 */
    addAnnotation : function(annotation){
        var ann = this._addAnnotation(annotation);
        this.opt.features.push(ann);
        this._updateView(this.opt.features);
        this.trigger('annotationAdded', ann);
    },
    
    /**
	 * Removes an annotation from the visualization.
	 * @param {int} id The annotation id.
	 * 
	 * @example 
	 * myCircularFeatureViewer.removeAnnotation(1);
	 * 
	 */
    removeAnnotation : function(id){
        var index = null;
        var ann = _.find(this.opt.features, function(f, i){
            index = i;
            return (f.id === id);
        });
        this.opt.features.splice(index, 1);
        this._organizeTracks();
        
        this._updateView(this.opt.features);
        this.trigger('annotationRemoved', ann);
    },
    
    /* 
     * Function: Biojs.CircularFeatureViewer._addAnnotation
     * Purpose:  Add an annotation to a track.
     * Returns:  annotation -> {Object} The annotation.
     * Inputs: annotation -> {Object} The annotation.
     */
    _addAnnotation : function(annotation){
        var track = _.find(this._tracks, function(t){
            return t.getOverlaps(annotation).length === 0;
        }) || this._createTrack(this._tracks.length);
            
        if(track.feats.length === 0) this._tracks.push(track);
            
        annotation.track = track.id;
        track.feats.push(annotation);
        
        return annotation;
    },
    
    /* 
     * Function: Biojs.CircularFeatureViewer._getSequenceChunk
     * Purpose:  get a sequence chunck arround the desired position
     * Returns:  seq -> {String} The sequence chunck.
     * Inputs: pos -> {int} Position in the sequence.
     *          pos -> {int} sequence size on each side of the desired position
     */
    _getSequenceChunk : function(pos, size){
        
        pos = pos - 1;//Strings start at 0!
        var seq = this.opt.sequence, str = '';
        if(pos - size < 0){
            str = seq.slice(pos-size) + seq.slice(0, pos);
        }else{
            str = seq.slice(pos-size, pos);
        }
        
        if(pos + size > seq.length){
            str = str + seq.slice(pos) + seq.slice(0, (pos + size - seq.length));
        }else{
            str = str + seq.slice(pos, pos + size);
        }
        return str;
    },
    /* 
     * Function: Biojs.CircularFeatureViewer._organizeTracks
     * Purpose:  Arranges annotations in tracks
     * Returns:  -
     * Inputs: -
     */
    _organizeTracks: function(){
        this._tracks = [],
        _.each(this.opt.features, this._addAnnotation, this);
    },
    /* 
     * Function: Biojs.CircularFeatureViewer._initVariables
     * Purpose:  Initializes private variables
     * Returns:  -
     * Inputs: -
     */
    _initVariables : function(){
        var self = this;
        
        self._radius = Math.min(self.opt.width, self.opt.height) / 2;
        var seq = self.opt.sequence;
        seq = seq.toUpperCase();
        
        self._seqToRad = d3.scale.linear().domain([1,seq.length]).range([0,2*Math.PI]);
        self._seqToDeg = d3.scale.linear().domain([1,seq.length]).range([0,360]);
        
        self._arc = d3.svg.arc()
            .outerRadius(function(d){ return (self._radius/2) + 12*(d.track) + 10})
            .innerRadius(function(d){ return (self._radius/2) + 12*(d.track)})
            .startAngle(function(d){
                return self._seqToRad(d.start);
            })
            .endAngle(function(d){ 
                return self._seqToRad(d.stop+1) + ((d.start > d.stop) ? + 2*Math.PI : 0);
            });
        
        //SVG tag
        self._svg = d3.select("#"+self.opt.target).append("svg")
                        .attr("width", self.opt.width)
                        .attr("height", self.opt.height);
        
        d3.select("#"+self.opt.target).attr('tabindex',0)
            .on("keydown", function(d) { 
                
                if(d3.event.keyCode === 37){//left arrow
                    self._rotate = true;
                    self._rotatefn(1);
                }else if(d3.event.keyCode === 39){//right arrow
                    self._rotate = true;
                    self._rotatefn(-1);
                }
            })
            .on("keyup", function(d) { 
                if(d3.event.keyCode === 37 || d3.event.keyCode === 39){//left arrow
                    self._rotate = false;
                }
            });
        
        self._svg.append("g").attr('class','main')
                    .attr("transform", "translate(" + self.opt.width / 2 + "," + self.opt.height / 2 + ") rotate(0)");
                    /*.call(d3.behavior.zoom().on("zoom", function(){
                        self._svg.selectAll('.main').attr("transform",
                            "translate(" + d3.event.translate + ")"+
                            " scale(" + d3.event.scale + ")");
                    }));*/
        
        // Sequence
        self._svg.append("text")
                        .attr('class', 'txt')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('font-size', '15px')
                        .attr('text-anchor','middle')
                        .attr('font-family', '"Lucida Console", Monaco, monospace')
                        .attr("transform", "translate(" + self.opt.width / 2 + "," + self.opt.height / 2 + ")")
                        .text(self._getSequenceChunk(1,10));
        
        //This is the accessor function we talked about above
        self._lineFunction = d3.svg.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .interpolate("linear");
        
        var lineData = [ { "x": self._radius,   "y": self._radius},  { "x": self._radius,  "y": (self._radius/2 + 12*self._tracks.length)}];
        
        self._svg.append("path").attr('class','line')
                    .attr("d", self._lineFunction(lineData))
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
        
        //Arrows
        var leftArrowData = [{x:self._radius/2, y:0 },{x:self._radius/2-10, y:10 },{x:self._radius/2-10, y:-10 }];
        self._svg.append("path").attr('class','arrow').attr('class','left')
                    .attr("d", self._lineFunction(leftArrowData))
                    .attr("transform", "translate(" + self.opt.width / 2 + "," + self.opt.height / 2 + ")")
                    .attr("stroke", "#666666")
                    .attr("stroke-width", 2)
                    .attr("fill", "#666666")
                    .on("mouseover", function () {
                        self._rotate = true;
                        self._rotatefn(1);
                    })
                    .on("mouseout", function () {
                        self._rotate = false;
                    });
        
        var leftArrowData = [{x:-self._radius/2, y:0 },{x:-self._radius/2+10, y:10 },{x:-self._radius/2+10, y:-10 }];
        self._svg.append("path").attr('class','arrow').attr('class','right')
                    .attr("d", self._lineFunction(leftArrowData))
                    .attr("transform", "translate(" + self.opt.width / 2 + "," + self.opt.height / 2 + ")")
                    .attr("stroke", "#666666")
                    .attr("stroke-width", 2)
                    .attr("fill", "#666666")
                    .on("mouseover", function () {
                        self._rotate = true;
                        self._rotatefn(-1);
                    })
                    .on("mouseout", function () {
                        self._rotate = false;
                    });
    },
    /* 
     * Function: Biojs.CircularFeatureViewer._rotatefn
     * Purpose:  rotates annotations
     * Returns:  -
     * Inputs: direction -> {int} direction of the rotation 1 -> clockwise, -1 -> counterclockwise.
     */
    _rotatefn : function(direction){
        
        var speed = this.opt.speed, self = this, element = self._svg.selectAll(".main"),
            oneAmino = self._seqToDeg(2),
            angle = +element.attr('transform').match(self._numInParenthesis)[1];
        
        d3.timer(function() {
            if(!self._rotate){
                return true;
            }
            
            angle = angle + direction*oneAmino*speed;
            element.attr("transform", "translate(" + self.opt.width / 2 + "," + self.opt.height / 2 + ") rotate(" + angle%360 + ")");
            
            var pos = (angle >= 0) ? Math.round(angle%360) : 360 + Math.round(angle%360);
            pos = Math.round(self._seqToDeg.invert(pos));
            
            self._svg.selectAll('.txt').transition()
      .ease('cubic-out')
      .duration('200').text(self._getSequenceChunk(pos,10));
        });
    },
    /* 
     * Function: Biojs.CircularFeatureViewer._updateView
     * Purpose:  updates the visualization
     * Returns:  -
     * Inputs: data -> {Object[]} annotations array.
     */
    _updateView : function(data){
        
        var self = this;
        var annotations = this._svg.selectAll(".main").selectAll(".annotation")
                    .data(data);
        
        var path = annotations.enter()
                    .append("path")
                    .attr("d", self._arc)
                    .attr('class', 'annotation')
                    .style("opacity", 0)
                    .style("stroke-width",1)
                    .style("stroke","black")
                    .style("fill", function(d) { return d.color || self._colorScale(d.type) })
                    .on("mouseover", function(d) {
                        self.trigger('annotationMouseover', d);
                    })
                    .on("mouseout",  function(d) {
                        self.trigger('annotationMouseout', d);
                    })
                    .on("click",  function(d) {
                        self.trigger('annotationClick', d);
                    });
        
        path.transition()
                .delay(function(d) { return (d.track + 1) * 50; })
                .duration(2000)
                .style('opacity', 1);
        
        // Remove old elements as needed.
        annotations.exit()
            .transition()
                .delay(function(d,i) { return i * 50; })
                .duration(2000)
                .style('opacity', 0).remove();
        
        var lineData = [ { "x": 0,   "y": 0},  { "x": 0,  "y": - self._radius/2 - 12*self._tracks.length}];
        
        self._svg.selectAll('.line')
                    .attr("d", self._lineFunction(lineData))
                    .attr("transform", "translate(" + self.opt.width / 2 + "," + self.opt.height / 2 + ")");
        
    },
    /* 
     * Function: Biojs.CircularFeatureViewer._createTrack
     * Purpose:  creates a track object
     * Returns:  track -> {Object} a track.
     * Inputs: id -> {int} track id.
     */
    _createTrack:function(id){
        var _feats = [];
        var _id = id;
        
        var _getOverlaps = function(feat){
            return _.filter(_feats,function(el){
                return _overlap(feat,el);
            });
        };
        
        var _inInterval = function(x,start,stop){
            return (x >= start && x <= stop);
        };
        
        var _remove = function(id){
            var index = null;
            _.find(_feats, function(f, i){
                index = i;
                return (f.id === id);
            });
            _feats.splice(index, 1);
        };
        
        var _overlap = function(featA, featB){
            
            if(featA.start > featA.stop /*&& featB.start < featB.stop*/){
                if(!_inInterval(featA.start,featB.stop, featB.start)  || !_inInterval(featA.stop, featB.stop, featB.start)){
                    return true;
                }else if(!_inInterval(featB.start, featA.stop, featA.start) || !_inInterval(featB.stop, featA.stop, featA.start)){
                    return true;
                }
            }else if (featB.start > featB.stop && featA.start < featA.stop){
                return _overlap(featB, featA);
            }
            
            if(_inInterval(featA.start, featB.start, featB.stop) || _inInterval(featA.stop, featB.start, featB.stop)){
                return true;
            }else if(_inInterval(featB.start, featA.start, featA.stop) || _inInterval(featB.stop, featA.start, featA.stop)){
                return true;
            }
            return false;
        }
        
        var track = {
            id:id,
            feats:_feats,
            getOverlaps:_getOverlaps,
            remove:_remove
        }
        return track;
    }
});

var Events = require('biojs-events');
Events.mixin(CircularFeatureViewer.prototype);
