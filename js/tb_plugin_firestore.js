/*!
 * Google Firebase Cloud Firestore functions for Thorium Mobile projects
 * Version 1.2.0 November, 2019
 * framework7 v5.x (https://framework7.io)
 * Google firebase (https://firebase.google.com)
 * framework7: MIT Licensed
 * Copyright 2018-2020 Thorium builder.
*/

var firestoredb = firebase.firestore();

/*-- Virtual List Construction --*/
function BuildVirtualListFromData(vlRef) {
  app.preloader.show();
  var uid = vlRef.id;
  vlRef.setAttribute("data-loaded", true);
  var templateId = uid + "-template";
  var ref = document.getElementById(templateId);
  var template = ref.innerHTML;
  var items = [];
  const f = vlRef.getAttribute('data-filter-field');
  const o = vlRef.getAttribute('data-filter-operator');
  const v = vlRef.getAttribute('data-filter-value');
  const t = vlRef.getAttribute('data-template');
  const limit = vlRef.getAttribute('data-limit') || null;
  const order = vlRef.getAttribute('data-order-field') || null;
  const usronly = vlRef.getAttribute('data-user-data')=="true"|| false;
  var collection = vlRef.getAttribute('data-collection') || null;
  if (!collection) {
    app.preloader.hide();
    app.emit('firebaseVirtualListLoadError', $(this), "Collection not Defined");
    app.dialog.alert("Error getting documents, Collection not Defined");
    return;
  }
  var query = firestoredb.collection(collection);
  if (f) {
    query = query.where(f, o, v)
  }
  if (usronly==true) {
    var u=firebase.auth().currentUser;	
    query = query.where('createdby','==',u.uid)
  }
  if ((limit)&&(limit>0)) {
    query = query.limit(parseInt(limit));
  }
  if (order) {
    var w = vlRef.getAttribute('data-order-way') || "asc";
    query = query.orderBy(order, w);
  }
  query.get()
    .then(function (querySnapshot) {
      var i = 0;
      querySnapshot.forEach(function (doc) {
        var item = {};
        item = doc.data();
        item["dataindex"] = i;
        item["uid"] = doc.id;
        items.push(item);
        i = i + 1;
      });
      var ref=app.virtualList.get(vlRef);
      if (ref) {
        app.virtualList.destroy(ref); //Destroy existing instance
      }
      var virtualList = app.virtualList.create({
        el: vlRef,
        items: items,
        createUl: true,
        setListHeight: true,
        searchAll: function (query, items) {
          var found = [];
          for (var i = 0; i < items.length; i++) {
            var contents = JSON.stringify(items[i]);
            if (contents.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
          }
          return found; //return array with matched indexes
        },
        itemTemplate: template,
        height: 0,
      });
      setTimeout(function () { app.preloader.hide(); }, 100);
      app.emit('firebaseVirtualListLoadSuccess', $(this), items.length);
    })
    .catch(function (error) {
      app.preloader.hide();
      app.emit('firebaseVirtualListLoadError', $(this), error);
      app.dialog.alert("Error getting documents: "+ error);
      return;
    });
}

function initFirebaseVirtualLists(reload) {
  var user = firebase.auth().currentUser;
  if (user) {
    reload = reload || false;
    $(".firebase-virtual-list-content").each(function (idx, field) {
      if ((field.getAttribute("data-loaded") != "true") || (reload == true)) {
        app.preloader.show();
        BuildVirtualListFromData(field);
      }
    });
  }
}
/*-- Virtual List Construction --*/

/*-- Virtual List Filters --*/
$(document).on('click', '.btn-firebase-filter', function (e) {
  e.preventDefault;
  app.emit('firebaseFilterBtnClick',e);
  var vl=e.target.getAttribute('data-filter-virtuallist'); 
  var virtualList=app.virtualList.get('#'+vl);
  if (virtualList) {
    var obj= document.getElementById(vl);
    const f=e.target.getAttribute('data-filter-field')||'';
    const o=e.target.getAttribute('data-filter-operator')||'==';
    const v=e.target.getAttribute('data-filter-value')||'';
    const limit = e.target.getAttribute('data-limit')||'';
    const order = e.target.getAttribute('data-order-field')||'';
    const way = e.target.getAttribute('data-order-way')||'asc';
    const usronly = e.target.getAttribute('data-user-data') || false;
    obj.setAttribute('data-filter-field',f);
    obj.setAttribute('data-filter-operator',o);
    obj.setAttribute('data-filter-value',v);
    obj.setAttribute('data-limit',limit);
    obj.setAttribute('data-order-field',order);
    obj.setAttribute('data-order-way',way);
    obj.setAttribute('data-user-data',usronly);
    BuildVirtualListFromData(obj);
  }
}) 
/*-- Virtual List Filters --*/

/*-- Edit Form Display--*/
function firebaseEditFormFillfromData(form, data,rowindex,parentvlid) {
  if (!data) {
    app.preloader.hide();
    $("#" + form.id).hide();
    app.dialog.alert('Record not found!');
    return;  
  }
  app.preloader.show();
  $("#" + form.id).attr("data-uid", data['uid']);
  const collection = $("#" + form.id).attr('data-firebase-collection');
  var currentRecord = firestoredb.collection(collection).doc(data['uid']);
  if (!currentRecord) {
    app.preloader.hide();
    app.dialog.alert('Record not found!');
    return;
  }
  var formData = {};
  currentRecord.get().then(function (doc) {
    if (doc.exists) {
      var snapshot = doc.data();
      for (var [key, value] of Object.entries(snapshot)) {
        var fld = document.getElementById(key);
        if (fld) {
          if (fld.type == 'checkbox') {
            formData[key] = [value];
          } else if (fld.type == 'image') {  
           if (value) {
            $('#'+fld.id).css('background-image',  'url(' + value + ')' ); 
           }
          } else if (fld.type == 'range') { 
            formData[key] = value;
          } else {
              var ot=$('#'+fld.id+"-fileinput");
              if ((ot) && (ot.length>0) && (ot[0].type == 'file')) {
                $('#'+fld.id+'-fileinput-link').show();
                $('#'+fld.id+'-fileinput-link span').html('<a class="external" target="_blank" rel="noopener" data-rel="external" target="_blank" href="'+value+'">See attached file</a>');
              }         
            formData[key] = value;
          }
        }
      }
      app.form.fillFromData("#" + form.id, formData);
      form.setAttribute("data-loaded", true);
      form.setAttribute("data-row-index",rowindex);
      form.setAttribute("data-virtuallist-id",parentvlid);
    } else {
      app.preloader.hide();
      app.dialog.alert("No such document!");
    }
  }).catch(function (error) {
    app.preloader.hide();
    app.dialog.alert("Error getting document: "+ error);
  });
}
/*-- Edit Form Display--*/

/*-- File Drag&Drop Management--*/
$(document).on('dragenter', '.firebase_document_preview , .firebase_fileupload-dropzone ', function (e) {	
  e.preventDefault(); 
  $(this).css("opacity","0.5");
});
$(document).on('dragover', '.firebase_document_preview , .firebase_fileupload-dropzone' , function (e) {	
  e.preventDefault(); 
  $(this).css("opacity","0.5");
  return false;
});
$(document).on('dragleave', '.firebase_document_preview , .firebase_fileupload-dropzone ', function (e) {	
  e.preventDefault(); 
  $(this).css("opacity","1");
});
$(document).on('drop', '.firebase_document_preview , .firebase_fileupload-dropzone', function (e) {	
  e.preventDefault(); 
  var f = e.dataTransfer.files;
  $(this).css("opacity","1");
  handleFileUpload(f,$(this));
  e.stopPropagation(); 
});
$(document).on('click', '.firebase_document_preview, .firebase_fileupload-dropzone', function (e) {	
  e.preventDefault(); 
  if ( (isLocal()==true)  && ( (app.device.ios) || (app.device.android) )) {
    var iconTooltip = app.tooltip.create({
      targetEl: $(this),
      text: 'Drop your file here',
    });
    iconTooltip.show();
  }
  var inp=$("#"+e.target.id+"-fileinput");
  if (inp) {
    inp.trigger('click'); 
  }  
});

function handleFileUpload(files, obj) {
  if (files.length>0) {
    var isImg=(obj[0].tagName.toLowerCase()=="input");
    var filesize = ((files[0].size / 1024) / 1024).toFixed(4); // MB
    if ( ( (isImg==true) && (filesize>firebaseImgMaxSize) ) || ( (isImg==false) && (filesize > firebaseDocMaxSize) ) ) {
      app.dialog.alert("File too large (Max Size Allowed: " + firebaseImgMaxSize + "Mb)");
      return;
    }
    if (isImg) {
        var reader = new FileReader();
        reader.onload = (function (aImg) {
          return function (e) {
            obj.css('background-image', 'url(' + e.target.result + ')');
          };
        })();
        reader.readAsDataURL(files[0]);
      } 
      $('#'+obj[0].id+'-fileinput-filename').css("visibility","visible");
      $('#'+obj[0].id+'-fileinput-filename span').text(files[0].name+" (size:"+files[0].size+" bytes - "+files[0].type+")");
      $('#'+obj[0].id+'-fileinput-link').hide();
      var fileinput=obj[0].id;
      $('#'+fileinput+'-fileinput').data("data-file",files[0]);
  }
}
$(document).on('change', '.firebase_document_input', function (e) {
  e.preventDefault();
  var di=$(this).attr('data-fileinput-ref');
  var o=$("#"+di);
  if (o) {
    handleFileUpload(e.target.files,o);
  } 
});	
$(document).on('click', '.firebase_fileupload-remove', function (e) {	
  e.preventDefault();
  var di=$(this).attr('data-fileinput-ref');
  var o=$("#"+di);
  if (o) {
    app.dialog.confirm('Remove file?', function () {
      $('#'+di+'-fileinput').data("data-file",null);
      $('#'+di+'-fileinput-filename').css("visibility","hidden");
      $('#'+di+'-fileinput-filename span').text("");
      $('#'+di).css("background-image","");
    }); 
  }  
});	
/*-- File Management--*/

/*-- Edit and Insert Form Save Images--*/
function saveFile(f, collection, uid, fieldName, currentRecord) {
  var filename = f.name;
  filename = filename.replace('C:\\fakepath\\', '');
  var extension = filename.substr((filename.lastIndexOf('.') + 1));
  var storage = firebase.storage();
  var storageRef = storage.ref().child(collection + '/');
  filename = fieldName + "_" + uid + "." + extension;
  var uploadTask = storageRef.child(filename).put(f)
    .catch(function (error) {
      app.preloader.hide();
      app.dialog.alert(error.message);
    })
    .then(function (e) {
      e.task.on('state_changed', function (snapshot) {
        //var uploader = document.getElementById('firebase-upload-progress');
        //uploader.value = progress;
      }, function (error) {
        app.preloader.hide();
        app.dialog.alert(error.message);
      }, function () {
        e.task.snapshot.ref.getDownloadURL()
          .then(function (url) {
            currentRecord.update(
              { [fieldName]: url }
            )
              .catch(function (error) {
                app.preloader.hide();
                app.dialog.alert("Error writing Image: "+ error.message);
                return;
              });
          })
          .catch(function (error) {
            app.preloader.hide();
            app.dialog.alert("Error while uploading image: "+ error.message);
          })
      });
    });
}
/*-- Edit Form Post Save Images--*/

/*-- Edit Form Submit--*/
$(document).on('submit', '.firebase-edit-form', function (e) {
  e.preventDefault;
  app.preloader.show();
  var collection = $(this).attr('data-firebase-collection');
  if (!(collection)) {
    app.preloader.hide();
    app.dialog.alert("Firebase Collection not defined");
    return;
  }
  var message = $(this).attr('data-form-message') || null;
  var postprocess = $(this).attr('data-form-postprocess') || 0;
  var uid = $(this).attr('data-uid') || null;
  if (!uid) {
    app.preloader.hide();
    app.dialog.alert("Record ID not defined");
    return;
  }
  var user = firebase.auth().currentUser;
  var currentRecord = firestoredb.collection(collection).doc(uid);
  if (!currentRecord) {
    app.dialog.alert('Record not found!');
    return;
  }
  var data = {};
  var f = e.target;
  for (var i = 0; i < f.length; i++) {
    var fld = f[i].name;
    var type = f[i].type;
    if (f[i].type == "radio") { if (f[i].checked === true) { data[fld] = f[i].value; } }
    else if (f[i].type == "checkbox") { if (f[i].checked == true) { data[fld] = "on" } else { data[fld] = "off" } }
    else if (f[i].type == "submit") { }
    else if (f[i].type == "file") {
      var oid = f[i].id;
      var file =$('#' + oid).data("data-file");
      var fieldName = $('#'+oid).attr('data-fileinput-ref');
      if (file) {
        saveFile(file, collection, uid, fieldName,currentRecord);
      }
    }
    else { data[fld] = f[i].value; }
    if ((fld) && (data[fld] != null)) {
      var c = currentRecord.update(
        { [fld]: data[fld] }
      )
      .then(function (docRef) {})
      .catch(function (error) {
          app.preloader.hide();
          app.dialog.alert("Error writing document: "+ error.message);
          return;
      });
    }
  }
  //Updating modifiedby / modifieddate
  var userid = null;
  if (user) { userid = user.uid; }
  var now = Date.now();
  currentRecord.update(
    { 'modifiedby': userid, 'modifieddate': now }
  )
    .then(function (docRef) {
      //Update Calling ViirtualList
      var parentvlid=f.getAttribute("data-virtuallist-id");
      var rowIndex=f.getAttribute("data-row-index");
      if (parentvlid) {
        var caller=$("#"+parentvlid);
        if (caller) {
          caller.attr('data-loaded',false);
          initFirebaseVirtualLists();
        }
      }
      //Post Form Process
      setTimeout(function () {
        app.preloader.hide();
        if (message) { app.dialog.alert(message); }
        if (postprocess == 0) {
          backToPreviousPage();
        } else if (postprocess == 1) {
          reloadHomePage();
        } else if (postprocess == 2) {
          e.target.reset();
        }
      }, 1000);
    })
    .catch(function (error) {
      app.preloader.hide();
      app.dialog.alert("Error Updating document: "+ error.message);
      return;
    });
})
/*-- Edit Form  Submit--*/

/*-- Display Form --*/
function firebaseDisplayFormFillfromData(form,data) {
  $("#" + form.id + " [data-firebase-field]").each(function (idx, jsonfield) {
    var tag = jsonfield.tagName.toLowerCase();
    var c = jsonfield.className.toLowerCase();
    var fld = jsonfield.getAttribute("data-firebase-field");

    if ((["embed-responsive-item"].indexOf(c) > -1) && (tag != "audio") && (tag != "video")) { //IMG
      if ((fld in data) && (data[fld])) {
        jsonfield.style.backgroundImage = "url('"+data[fld]+"')";
      } else {
        jsonfield.style.display = 'none';
      }
    } else if ((["embed-responsive-item"].indexOf(c) > -1) && (tag == "video")) {  //video
      if ((fld in data) && (data[fld])) {
        jsonfield.setAttribute("src",data[fld]);
      } else {
        $('#'+jsonfield.id).parent().hide();
      }
    } else if (tag == "audio")  {  // audio
      if ((fld in data) && (data[fld])) {
        jsonfield.setAttribute("src",data[fld]);
      } else {
        jsonfield.style.display = 'none';
      }  
    } else {
      if (fld in data) {
        jsonfield.innerHTML = (data[fld]);
        if (tag == "a") { jsonfield.setAttribute("href", data[fld]); }
      } else {
        jsonfield.style.display = 'none';
      }
    }
  });
  form.setAttribute("data-loaded", true);
}
/*-- Display Form --*/

/* -- firebase Insert Form Submit--*/
$(document).on('submit', '.firebase-insert-form', function (e) {
  e.preventDefault;
  app.preloader.show();
  var collection=$(this).attr('data-firebase-collection');
  if (!(collection)) {
    app.preloader.hide();
    app.dialog.alert("Firebase Collection not defined");
    return;
  }
  var message=$(this).attr('data-form-message')||null;
  var postprocess=$(this).attr('data-form-postprocess')||0;
  //Create Blank Record in a transaction
  var user=firebase.auth().currentUser;	
  var userid=null;
  if (user) {userid=user.uid;}
  var now = Date.now();
  var record=firestoredb.collection(collection).add(
    {'createdby': userid,'createddate': now}
  )
  .catch(function(error) {
    app.preloader.hide();
    app.dialog.alert("Error writing document: "+ error.message);
  })
  .then(function(docRef) {
    var data = {};
    var f=e.target;
    for(var i = 0; i < f.length; i++){
      var fld=f[i].name;
      if (f[i].type=="radio") {
          if (f[i].checked===true) { data[fld]=f[i].value; }
      }
      else if (f[i].type=="checkbox") {
        data[fld]=f[i].checked; 
      }
      else if (f[i].type=="submit") {}
      else if (f[i].type == "file") {
        var oid = f[i].id;
        var file =file=$('#' + oid).data("data-file");
        var fieldName = $('#'+oid).attr('data-fileinput-ref');
        if (file) {
          saveFile(file, collection, docRef.id, fieldName,docRef);
        }
      }
      else { data[fld]=f[i].value; }
      if ((fld) && (data[fld]!=null)) {
        var c=docRef.update(
          {[fld]: data[fld]}
        )
        .then(function(docRef) {
          
        })
        .catch(function(error) {
          docRef.delete();
          app.preloader.hide();
          app.dialog.alert("Error writing document: "+ error.message);
          return;
        });
      }
    }
    //Post Form Process
    setTimeout(function () {
      app.preloader.hide();
      if (message) { app.dialog.alert(message); }
      if (postprocess == 0) {
        backToPreviousPage();
      } else if (postprocess == 1) {
        reloadHomePage();
      } else if (postprocess == 2) {
        e.target.reset();
      }
    }, 1000);

  });
})
/* -- firebase Insert Form--*/

/*-- Virtual list line click--*/
$(document).on('click', 'a.item-firebase', function (e) {
  e.preventDefault();
  var rowindex = $(this).attr('data-index') || null;
  var datakey = $(this).attr('data-key') || null;
  if (rowindex) {
    var o = $(this).parents(".firebase-virtual-list-content");
    if (o) {
      var vl = app.virtualList.get("#" + o[0].id);
      var datatarget = o.attr('data-detail') || null;
      var itemSel = vl.items[rowindex];
      var view = app.view;
      var parentVl=$(this).closest(".virtual-list")||null;
      var parentID=null;
      if (parentVl) {parentID=parentVl[0].id;}
      if ((view) && (view.length > 0)) {
        app.emit('firebaseVirtualListLineClick', $(this),rowindex,itemSel,datatarget);
        view[0].router.navigate('/' + datatarget + '/?rowindex=' + rowindex + '&data=' + encodeURIComponent(JSON.stringify(itemSel)) + "&key=" + datakey+"&parentvlid="+parentID);
      }
    }
  }
});  
/*-- Virtual list Button Link Click--*/
$(document).on('click', 'a.btn-firebase-page', function (e) {
  e.preventDefault();
  var rowindex = $(this).attr('data-index') || null;
  var datakey = $(this).attr('data-key') || null;
  var datatarget = $(this).attr('data-target') || null;
  var transition= $(this).attr('data-transition') || null;
  if (rowindex) {
    var o = $(this).parents(".firebase-virtual-list-content");
    if (o) {
      var vl = app.virtualList.get("#" + o[0].id);
      var itemSel = vl.items[rowindex];
      var view = app.view;
      var parentVl=$(this).closest(".virtual-list")||null;
      var parentID=null;
      if (parentVl) {parentID=parentVl[0].id;}
      if ((view) && (view.length > 0)) {
        app.emit('firebaseVirtualListLineClick', $(this),rowindex,itemSel,datatarget);
        view[0].router.navigate('/' + datatarget + '/?rowindex=' + rowindex + '&data=' + encodeURIComponent(JSON.stringify(itemSel)) + "&key=" + datakey+"&parentvlid="+parentID,{ animate: true,transition: transition,reloadAll: false });
      }
    }
  }
});  

function deleteDocument(vl,itemSel) {
  app.preloader.show();
  var parentvlid=vl.el.id;
  if (parentvlid) {
   var caller=$("#"+parentvlid);
   if (caller) {
    var collection = caller.attr('data-collection') || null;
    var uid=itemSel.uid;
    var doc=firestoredb.collection(collection).doc(uid);
    if (!doc) {
      app.preloader.hide();
      app.dialog.alert('Record not found');
      return;
    }
    doc.delete().then(function() {
      caller.attr('data-loaded',false);
      initFirebaseVirtualLists();
      app.preloader.hide();
      app.emit('firebaseVirtualListDeleteSuccess',vl,itemSel);
    })
    .catch(function(error) {
      app.preloader.hide();
      app.dialog.alert('Delete Error '+error.message);
      return;
    });
  }
} 
/*
  app.emit('firebaseVirtualListDeleteSuccess',$(this),rowindex,itemSel);*/
}

$(document).on('click', 'a.btn-firebase-delete', function (e) {
  e.preventDefault();
  var rowindex = $(this).attr('data-index') || null;
  var datakey = $(this).attr('data-key') || null;
  var m= $(this).attr('data-confirm-message') || 'Delete?'; 
  if (rowindex) {
    var o = $(this).parents(".firebase-virtual-list-content");
    if (o) {
      var vl = app.virtualList.get("#" + o[0].id);
      var itemSel = vl.items[rowindex];
      var view = app.view;
      var parentVl=$(this).closest(".virtual-list")||null;
      var parentID=null;
      if (parentVl) {parentID=parentVl[0].id;}
      if ((view) && (view.length > 0)) {
        app.emit('firebaseVirtualListLineDeleteClick', $(this),rowindex,itemSel);
        app.dialog.confirm(m, function () {
          setTimeout(function(){ deleteDocument(vl,itemSel) ; }, 100);
        }); 
      }
    }
  }
}); 





/*-- Swipe Buttons --*/
$(document).on('click', 'a.swipeoutbutton-firebase.swipeout-custom-action', function (e) {
  e.preventDefault();
  var rowindex = $(this).attr('data-index') || null;
  if (rowindex) {
    var o = $(this).parents(".firebase-virtual-list-content");
    if (o) {
      var vl = app.virtualList.get("#" + o[0].id);
      var target = o.attr('data-detail') || null;
      var itemSel = vl.items[rowindex];
      var view = app.view;
      if ((view) && (view.length > 0)) {
        app.emit('firebaseSwipeoutButtonClick', $(this),rowindex,itemSel,target);
      }
    }
  }
});  
$(document).on('click', 'a.swipeoutbutton-firebase.swipeout-detail-action', function (e) {
  e.preventDefault();
  var rowindex = $(this).attr('data-index') || null;
  if (rowindex) {
    var o = $(this).parents(".firebase-virtual-list-content");
    if (o) {
      var vl = app.virtualList.get("#" + o[0].id);
      var target = o.attr('data-detail') || null;
      var itemSel = vl.items[rowindex];
      var view = app.view;
      if ((view) && (view.length > 0)) {
        app.emit('firebaseSwipeoutButtonClick', $(this),rowindex,itemSel,target);
        view[0].router.navigate('/' + target + '/?rowindex=' + itemSel.rowindex + '&data=' + encodeURIComponent(JSON.stringify(itemSel)));
      }
    }
  }
});  

$(document).on('click', 'a.swipeoutbutton-firebase.swipeout-delete-action', function (e) {
  e.preventDefault();
  var obj=$(this);
  app.dialog.confirm('Are you feel good today?', function () {
    var rowindex = obj.attr('data-index') || null;
    if (rowindex) {
      var o = obj.parents(".firebase-virtual-list-content");
      if (o) {
        var vl = app.virtualList.get("#" + o[0].id);
        var target = o.attr('data-detail') || null;
        var itemSel = vl.items[rowindex];
        var view = app.view;
        if ((view) && (view.length > 0)) {
          app.emit('firebaseVirtualListDeleteSuccess',obj,rowindex,itemSel,target);
          var indexes=[];
          indexes.push(rowindex); 
          vl.deleteItems(indexes);
        }
      }
    }
  });
});  
/*-- Swipe Buttons --*/


/* -- Page Mounted Events --*/
$(document).on('page:mounted', function (e) {
  e.preventDefault;
  var p = e.detail;
  var appRoute;
  var jsonData;
  var rowindex;
  var parentvlid;
  var key;
  if (p === page) { elt = app.root; } else { elt = p.$el; appRoute = p.route; }
  if (elt) {
    if (appRoute) {
      jsonData = appRoute.query.data || null;
      rowindex = appRoute.query.rowindex || null;
      parentvlid= appRoute.query.parentvlid || null;
      key = appRoute.query.key || null;
      var data;
      try {
        data = JSON.parse(jsonData);
      }
      catch (e) {
        app.preloader.hide();
        app.dialog.alert(e);
        return;
      }
      $(".firebase-form").each(function (idx, form) {
        if (form.getAttribute("data-loaded") != "true") {
           firebaseDisplayFormFillfromData(form, data);
        }
      });
      $(".firebase-edit-form").each(function (idx, form) {
           firebaseEditFormFillfromData(form, data,rowindex,parentvlid);
      });
      app.preloader.hide();
    }
  }
})

firebase.auth().onAuthStateChanged(function(user) {
	app.preloader.hide();
	if (user) {
    initFirebaseVirtualLists();
  }
})  

$(document).on('page:init', function (e) {
  e.preventDefault; 
  initFirebaseVirtualLists();
})

if (app.initialized==true) {
  initFirebaseVirtualLists();
}




