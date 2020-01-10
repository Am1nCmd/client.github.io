/*!
 * Google Firebase functions for Thorium Mobile projects
 * Version 1.2.0 November, 2019
 * framework7 v5.x (https://framework7.io)
 * Google firebase (https://firebase.google.com)
 * framework7: MIT Licensed
 * Copyright 2018-2020 Thorium builder.
*/

var db;
var ls;
var rsp;
var rs;
var ps;
var avatarChanged = false;

/* -- Firebase Auth Screen Translation --*/
function translatescreen() {
	var resources = getLangResources()["tr"];
	$("*[data-translate]:not(input, textarea)").each(function (i, elt) {
		var t = resources[$(elt).attr("data-translate")];
		if (t) { elt.innerText = t; }
	});
	$("input[data-translate]").each(function (i, elt) {
		var t = resources[$(elt).attr("data-translate")];
		if (t) { elt.placeholder = t; }
	});
}
/* -- Firebase Auth Screen Translation --*/

function showLoginScreen() {
	ls = app.loginScreen.create({ el: '.login-screen' });
	ls.open(true);	
}
function showRegisterScreen() {
	rs = app.popup.create({ el: '.register-screen', swipeToClose: true });
	rs.open(true);
}
function showResetPwScreen() {
	rsp = app.popup.create({ el: '.resetpassword-screen', swipeToClose: true });
	$(".firebase_resetpw_email").val($(".firebase_email").val());
	rsp.open(true);
}

/* -- Firebase Auth Initialisation --*/
if (firebase) {
	var firebaseApp = firebase.initializeApp(firebaseConfig);
	if (firebaseApp) {
	} else {
		firebase.auth().useDeviceLanguage();
		db = firebase.firestore();
		app.dialog.alert('Unable to initialize Firebase ');
	}
} else {
	app.dialog.alert('Unable to initialize Firebase ');
}

/* -- Auth Listener --*/
firebase.auth().onAuthStateChanged(function (user) {
	app.preloader.hide();
	if (user) {
		// User is signed in.
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;
		$('.firebase-user-logout').show();
		$('#firebase_login').hide();
		$(".firebase_email").val(user.email);
		$(".firebase_displayname").text(user.displayName);
		if (user.isAnonymous==true) {
			$(".firebase_avatar").attr('src', "img/defaultavatar.png");
			$(".firebase_avatar").attr('alt', "anonymous");
			$(".firebase_avatar").attr('title', "anonymous");
			$(".firebase_avatar").hide();
		} else {
			$(".firebase_avatar").attr('src', user.photoURL);
			$(".firebase_avatar").attr('alt', user.displayName);
			$(".firebase_avatar").attr('title', user.displayName);
			$(".firebase_avatar").show();
		}
		$("#view-main").show();
		if (ls) { ls.close(); }
	} else {
		// User is signed out.
		$("#auth_name").text("");
		$("#auth_img").attr('src', "");
		$('.firebase-user-logout').hide();
		$('#firebase_login').show();
		$(".firebase_email").val("");
		$(".firebase_displayname").text("");
		$(".firebase_avatar").attr('src', "img/defaultavatar.png");
		$(".firebase_avatar").attr('alt', "");
		$(".firebase_avatar").attr('title', "");
		if (firebaseAnonymous == false) {
			showLoginScreen();
		} else {
			firebase.auth().signInAnonymously().catch(function (error) {
				app.dialog.alert("Anonymous Login: " + error.message);
				showLoginScreen();
			});
		}
	}
});
/* -- Auth Listener --*/

/* -- EDIT PROFILE --*/
/*-- Edit Profile Submit --*/
$(document).on('submit', '.firebase-profile-form', function (e) {
	var user = firebase.auth().currentUser;
	var photoURL = firebase.auth().photoURL || 'img/defaultavatar.png';
	if (user) {
		app.preloader.show();
		var uid = user.uid;
		if (avatarChanged == true) {
			//var localFile = document.getElementById('firebase_profile_avatar_input').files[0];
			var localFile = $("#firebase_profile_avatar_input").data("data-file");
			var filename = localFile.name;
			filename = filename.replace('C:\\fakepath\\', '');
			var extension = filename.substr((filename.lastIndexOf('.') + 1));
			var storage = firebase.storage();
			var storageRef = storage.ref().child(firebaseStoragePath + '/');
			filename = uid + "." + extension;
			var url;
			var uploadTask = storageRef.child(filename).put(localFile)
				.catch(function (error) {
					app.preloader.hide();
					app.dialog.alert(error.message);
					return;
				})
				.then(function (e) {
					// all working for progress bar that in html 
					// to indicate image uploading... report 
					e.task.on('state_changed', function (snapshot) {
						var progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						var uploader = document.getElementById('firebase-upload-progress');
						uploader.value = progress;
					}, function (error) {
						app.preloader.hide();
						app.dialog.alert(error.message);
					}, function () {
						e.task.snapshot.ref.getDownloadURL()
							.then(function (downloadURL) {
								$('.firebase_avatar').attr('src', downloadURL);
								user.updateProfile({
									photoURL: downloadURL
								}).catch(function (error) {
									app.preloader.hide();
									app.dialog.alert(error.message);
								});
							});
					});
				});

		}
		var displayName = $("#firebase_profile_displayname").val();
		user.updateProfile({
			displayName: displayName
		}).catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
		}).then(function (e) {
			setTimeout(function () {
				app.preloader.hide();
				ps.close();
			}, 1000);
		});
	}
});
/* -- Edit Profile Profile Image Management --*/
$("html").on("drop", function (e) { e.preventDefault(); });
$("html").on("dragover", function (e) { e.preventDefault(); });
$(document).on('dragenter', '.firebase_profile_avatar', function (e) {
	e.preventDefault();
	$(this).css("opacity", "0.5");
	e.stopPropagation();
});
$(document).on('dragleave', '.firebase_profile_avatar', function (e) {
	e.preventDefault();
	$(this).css("opacity", "1");
	e.stopPropagation();
});
$(document).on('drop', '.firebase_profile_avatar', function (e) {
	e.preventDefault();
	var f = e.dataTransfer.files[0];
	$(this).css("opacity", "1");
	handleProfileImage(f);
	e.stopPropagation();
});
$(document).on('click', '.firebase_profile_avatar', function (e) {	 /*-- Click on user Profile Image --*/
	e.preventDefault;
	if ((isLocal() == true) && ((app.device.ios) || (app.device.android))) {
		var iconTooltip = app.tooltip.create({
			targetEl: $(this),
			text: 'Drop your file here',
		});
		iconTooltip.show();
	}
	$('.firebase_profile_avatar_input').trigger('click');
});

function handleProfileImage(file) {
	var filesize = ((file.size / 1024) / 1024).toFixed(4); // MB
	if (filesize > firebaseImgMaxSize) {
		app.dialog.alert("Image too large (Max: " + firebaseImgMaxSize + "Mb)");
		avatarChanged = false;
	} else {
		var reader = new FileReader();
		reader.onload = function (e) {
			var src = e.target.result;
			$(".firebase_profile_avatar").attr('src', src);
			$("#firebase_profile_avatar_input").data("data-file", file);
			avatarChanged = true;
		}
		reader.readAsDataURL(file);
	}
}

function onAvatarChange(e) {
	var file = e.target.files[0];
	handleProfileImage(file);
}

$(document).on('change', '.firebase_profile_avatar_input', function (e) {
	e.preventDefault();
	onAvatarChange(e);
});

/* -- Profile Image Management --*/
/* -- EDIT PROFILE --*/


/* -- RESET PASSWORD FORM --*/
$(document).on('submit', '.firebase-resetpw-form', function (e) {
	e.preventDefault();
	app.dialog.confirm('Reset Password?', function () {
		var em = $('.firebase_resetpw_email').val();
		if (em.length > 0) {
			app.preloader.show();
			firebase.auth().sendPasswordResetEmail(em)
				.then(function () {
					app.preloader.hide();
					$(".firebase_email").val(em);
					app.dialog.alert("an email has been sent to your address");
					rsp.close();
				})
				.catch(function (error) {
					app.preloader.hide();
					app.dialog.alert(error.message);
				});
		}
	});
});
/* -- RESET PASSWORD FORM --*/

/* -- LOGOUT --*/
function auth_logout() {
	app.preloader.show();
	firebase.auth().signOut()
		.then(function () {
			app.preloader.hide();
			app.view[0].router.navigate('/', { animate: false, reloadAll: true });
		})
		.catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
		});
}
/* -- LOGOUT --*/

/* -- SIGN IN FORM --*/
$(document).on('submit', '.firebase-signin-form', function (e) {
	e.preventDefault();
	app.preloader.show();
	var email = $(".firebase_email").val();
	var password = $(".firebase_password").val();
	app.preloader.show();
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then(function () {
			app.preloader.hide();
		})
		.catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
		});
});
/* -- SIGN IN FORM --*/

/* -- REGISTER FORM --*/
$(document).on('submit', '.firebase-register-form', function (e) {
	e.preventDefault();
	app.preloader.show();
	var email = $("#firebase_register_email").val();
	var password = $("#firebase_register_password").val();
	var pwverification = $("#firebase_register_password_verification").val();
	if (password != pwverification) {
		app.preloader.hide();
		app.dialog.alert("Password does not match");
		$("#firebase_register_password_verification").focus();
		return;
	}
	if (password.length < 6) {
		app.preloader.hide();
		app.dialog.alert("Password must contain at least 6 characters");
		$("#firebase_register_password").focus();
		return;
	}
	app.preloader.show();
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
			return;
		}).then(function (e) {
			app.preloader.hide();
			if (e) {
				var uid = e.user.uid;
				var n = $("#firebase_register_displayname").val();
				if (e.user) {
					e.user.updateProfile({
						displayName: displayname,
						photoURL: 'img/defaultavatar.png'
					}).catch(function (error) {
						app.preloader.hide();
						app.dialog.alert(error.message);
					});
					app.preloader.hide();
				}
			}
		});
});
/* -- REGISTER FORM --*/


/* -- AUTH EVENTS HANDLERS --*/
$(document).on('click', '.firebase_register', function (e) {
	e.preventDefault();
	showRegisterScreen();
});
$(document).on('click', '.firebase_resetpasswword', function (e) {
	e.preventDefault();
	showResetPwScreen();
});
$(document).on('click', '.firebase_editprofile', function (e) {
	e.preventDefault();
	ps = app.popup.create({ el: '.profile-screen', swipeToClose: false });
	$(".firebase_resetpw_email").val($(".firebase_email").val());
	var user = firebase.auth().currentUser;
	if (user) {
		ps.open(true);
		$(".firebase_profile_displayname").val(user.displayName);
		$(".firebase_profile_email").val(user.email);
		$(".firebase_profile_avatar").attr("src", user.photoURL);
		$('.firebase-displayname').text(user.displayName);
	}
});
$(document).on('click', '.firebase-user-logout', function (e) {
	e.preventDefault();
	app.dialog.confirm('Logout?', auth_logout);
});
$(document).on('click', '.firebase_fb_login', function (e) {
	e.preventDefault();
	// Sign in using a popup.
	var provider = new firebase.auth.FacebookAuthProvider();
	provider.addScope('user_birthday');
	firebase.auth().signInWithPopup(provider)
		.then(function (result) {
			// This gives you a Facebook Access Token.
			var token = result.credential.accessToken;
			var user = result.user;
		})
		.catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
		});
});

$(document).on('click', '.firebase_google_login', function (e) {
	e.preventDefault();
	var provider = new firebase.auth.GoogleAuthProvider();
	provider.addScope('profile');
	provider.addScope('email');
	firebase.auth().signInWithPopup(provider)
		.then(function (result) {
			// This gives you a Google Access Token.
			var token = result.credential.accessToken;
			// The signed-in user info.
			var user = result.user;
		})
		.catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
			return;
		});
});

$(document).on('click', '.firebase_twitter_login', function (e) {
	e.preventDefault();
	var provider = new firebase.auth.TwitterAuthProvider();
	firebase.auth().signInWithPopup(provider)
		.then(function (result) {
			// This gives you a Google Access Token.
			var token = result.credential.accessToken;
			// The signed-in user info.
			var user = result.user;
		})
		.catch(function (error) {
			app.preloader.hide();
			app.dialog.alert(error.message);
			return;
		});
});

$(document).on('click', '.firebase_avatar', function (e) {
	e.preventDefault();
	var popover = app.popover.open(".firebase-popover", $(this), true);
});

$(document).on('input', '.firebase_profile_displayname', function (e) {
	$('.firebase-displayname').text($('.firebase_profile_displayname').val());
});
/* -- AUTH EVENTS HANDLERS --*/

/* -- INITIALISATION --*/
if (app.initialized == true) {
	$('#view-main').hide();
	translatescreen();
	$('.login-screen-title').text(app.name);
	app.preloader.show();
}
/* -- INITIALISATION --*/
