import Vuex from 'vuex';
import Cookie from 'js-cookie'; // npm install --save js-cookie

// this function used in initAuth to get cookies from the server
const getCookie = function (req, key) {
	return req.headers.cookie
		.split(';')
		.find(c => c.trim().startsWith(key + '='))
		.split('=')[1];
};

const createStore = () => {
	return new Vuex.Store({
		state: {
			loadedPosts: [],
			token: null,
		},
		mutations: {
			setPosts(state, posts) { // state, payload
				state.loadedPosts = posts; // posts => []
			},
			addPost(state, post) {
				state.loadedPosts.push(post);
			},
			editPost(state, editedPost) {
				const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
				state.loadedPosts[postIndex] = editedPost;
			},
			setToken(state, token) {
				state.token = token;
			},
			clearToken(state) {
				state.token = null;
			}
		},
		actions: {
			async nuxtServerInit(vuexContext, context) {
				try {
					const res = await fetch(`${process.env.baseUrl}/posts.json`)
					const data = await res.json();
					// console.log(data);
					// {
					//     '-NEgzrdrfTHu7VaejH2C': {
					//         author: 'Ahmed',
					//         content: 'Testing Ba2a',
					//         previewText: 'Work ????',
					//         thumbnail: 'https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=300&lazy=load',
					//         title: 'Testing'
					//     }
					// }
					if (!res.ok) throw new Error(`${data.message} (${res.status})`);
					const postsArray = [];
					for (const key in data) {
						postsArray.push({ ...data[key], id: key });
					}
					vuexContext.commit('setPosts', postsArray)
				} catch (err) {
					context.error(`### Error , ${err}`)
				}
			},
			async addPost(vuexContext, post) {
				try {
					const createPost = { ...post, updatedDate: new Date() }
					const res = await fetch(
						`https://nuxt-blog-48525-default-rtdb.firebaseio.com/posts.json?auth=${vuexContext.getters.token}`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(createPost),
						}
					);
					const data = await res.json();
					if (!res.ok) throw new Error(`${data.message} (${res.status})`);
					console.log(data); // {name: '-NEhcoG74-3IZU9fgdMB'}
					vuexContext.commit('addPost', { ...createPost, id: data.name });
					return data;
				} catch (err) {
					console.log('Something went wrong - maybe you want to login again');
					throw err;
				}
			},
			async editPost(vuexContext, editedPost) {
				try {
					const res = await fetch(`https://nuxt-blog-48525-default-rtdb.firebaseio.com/posts/${editedPost.id}.json?auth=${vuexContext.getters.token}`, {
						method: 'PUT',
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(editedPost),
					})
					const data = await res.json();
					console.log(data);
					if (!res.ok) throw new Error(`${data.message} (${res.status})`);
					vuexContext.commit('editPost', editedPost)
				} catch (err) {
					console.log('Something went wrong - maybe you want to login again');
					console.log(err);
				}
			},
			setPosts(vuexContext, posts) {
				vuexContext.commit('setPosts', posts);
			},
			async authenticateUser(vuexContext, authData) { // authData = { isLogin, email, password }
				let authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`; // login url as a default
				if (!authData.isLogin) {
					// make signup
					authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`;
				}
				try {
					const res = await fetch(authUrl, {
						method: "POST",
						body: JSON.stringify({
							email: authData.email,
							password: authData.password,
							returnSecureToken: true,
						}),
					});
					const data = await res.json();
					if (!res.ok) {
						throw new Error(`Faild to authenticate ${data.message} (${res.status})`);
					}
					console.log(data);
					vuexContext.commit('setToken', data.idToken);

					// store token , expire date in the localstorage
					localStorage.setItem('token', data.idToken);
					/*
							new Date().getTime() => get currnet time in ms 
							EX:)
							now is 4:00 , expires in 10 mins
							so we save tokenExpiration = 4:10
					*/
					const willExpiresIn = new Date().getTime() + Number.parseInt(data.expiresIn) * 1000; // for check remove *1000 will expires in 3.5 sec
					localStorage.setItem('tokenExpiration', willExpiresIn);

					// store the token id , expirationDate in the server - in cookie
					Cookie.set('jwt', data.idToken);
					Cookie.set('expirationDate', willExpiresIn);

					// backend - Not Work
					await fetch('http://localhost:3000/api/track-data', {
						method: "POST",
						body: JSON.stringify({
							data: 'Authentecated - backend'
						})
					});
					// return this.$axios.$post('http://localhost:3000/api/track-data', { "data": 'Authenticated!' })
				} catch (err) {
					throw new Error("Somthing went wrong in auth !!!");
				}
			},
			initAuth(vuexContext, req) {
				let token;
				let expirationDate;
				if (req) {
					if (!req.headers.cookie) return;
					// cookies are stored in the server with ; in between
					token = getCookie(req, 'jwt');

					if (!token) return;

					expirationDate = getCookie(req, 'expirationDate');
				} else if (process.client) {
					token = localStorage.getItem('token'); // if no (token = undefined)
					expirationDate = localStorage.getItem('tokenExpiration'); // 4:20
				}
				if (new Date().getTime() > +expirationDate || !token) { // current date > expirationDate
					console.log('time expired or No token or invalid token');
					vuexContext.dispatch('logout');
					return;
				}
				vuexContext.commit('setToken', token);
			},
			logout(vuexContext) {
				vuexContext.commit('clearToken');
				Cookie.remove('jwt');
				Cookie.remove('expirationDate');
				if (process.client) {
					localStorage.removeItem('token');
					localStorage.removeItem('tokenExpiration');
				}
			}
		},
		getters: {
			loadedPosts(state) {
				return state.loadedPosts;
			},
			token(state) {
				return state.token;
			},
			isAuthenticated(state) {
				return state.token !== null;
			},
		},
	});
};
export default createStore;

// cookies
// cookie = "username=John Smith; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";