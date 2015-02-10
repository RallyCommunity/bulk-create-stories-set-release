Ext.define('CustomApp', {
    extend: 'Rally.app.TimeboxScopedApp',
    componentCls: 'app',
    scopeType: 'release',
    comboboxConfig: {
        fieldLabel: 'Select a Release:',
        labelWidth: 100,
        width: 300
    },
   
    onScopeChange: function() {
        var that = this;
        if (!this.down('#create-button')) {
            this.add({
                xtype  : 'rallybutton',
                text   : 'create',
                itemId: 'create-button',
                handler: function() {
                    that._getModel(); 
                }
            });
        }
        
    },
    
    _getModel: function(){
        var that = this;
        Rally.data.ModelFactory.getModel({
            type: 'UserStory',
            success: function(model) {  //success on model retrieved
                var count = 3;
                for(var i=1;i<count;i++){
                    that._model = model;
                    var story = Ext.create(model, {
                        Name: 'story ' + i
                    });
                    story.save({
                        callback: function(result, operation) {
                            if(operation.wasSuccessful()) {
                                console.log("_ref",result.get('_ref'), ' ', result.get('Name'));
                                that._record = result;
                                that._readAndUpdate();
                            }
                            else{
                                console.log("?");
                            }
                        }
                    });
                }
                
            }
        });
        
            
    },
        
    _readAndUpdate:function(){
        var id = this._record.get('ObjectID');
        var release = this.getContext().getTimeboxScope().record;
        console.log('OID', id);
        this._model.load(id,{
            fetch: ['Name', 'FormattedID', 'Release'],
            callback: function(record, operation){
                console.log('Release prior to update:', record.get('Release'));
                if(release){
                    record.set('Release', release.get('_ref'));
                }
                record.save({
                    callback: function(record, operation) {
                        if(operation.wasSuccessful()) {
                            console.log('Release after update..', record.get('Release'));
                        }
                        else{
                            console.log("problem..");
                        }
                    }
                });
            }
        });
    }
});
