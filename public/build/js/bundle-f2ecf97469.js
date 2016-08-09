/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Include the CSRF TOKEN for every post requests
	$.ajaxSetup({
		headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
	});

	var App = function (_React$Component) {
		_inherits(App, _React$Component);

		function App(props) {
			_classCallCheck(this, App);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

			_this._onNumberChange = function (pos) {
				return function (event) {
					var val = event.target.value;

					// Do not allow for values lesser than 1 or more than 9
					if (!val == '') {
						if (val < 1 || val > 9 || val == _this.state.first || val == _this.state.second || val == _this.state.third) {
							return;
						}
					}

					_this.setState(_defineProperty({}, pos, val));
				};
			};

			_this._onGenerateClick = function () {
				var first = _this._generate();
				var second = '';
				var third = '';

				var generatedNo = _this._generate();

				while (generatedNo === first) {
					generatedNo = _this._generate();
				}
				second = generatedNo;

				while (generatedNo === first || generatedNo === second) {
					generatedNo = _this._generate();
				}
				third = generatedNo;

				_this.setState({
					first: first,
					second: second,
					third: third
				});
			};

			_this._onSubmit = function () {
				var first = _this.state.first;
				var second = _this.state.second;
				var third = _this.state.third;

				// Check for empty fields
				if (s.isBlank(first) || s.isBlank(second) || s.isBlank(third)) {
					alert('One of the field is empty!');
					return;
				}

				_this.setState({ error: false, message: 'Please wait...' });

				var data = { first: first, second: second, third: third };

				// Request
				$.ajax({
					url: '/lottery_numbers',
					type: 'POST',
					data: data,
					success: function (response) {
						if (response.success) {
							this.setState({ error: false, message: 'Success!', first: '', second: '', third: '' });
						} else {
							if (response.error_code == 2) {
								this.setState({ error: true, message: response.message });
							} else if (response.error_code == 3) {
								var date = moment.utc(response.date_selected).local().format('MMM DD, YYYY hh:mm A');
								this.setState({ error: true, message: response.message + ' Last Selected On: ' + date });
							}
						}
					}.bind(_this),
					error: function (data) {
						var errors = data.responseJSON;
						console.log(errors);
					}.bind(_this)
				});
			};

			_this.state = {
				error: false,
				message: '',
				first: '',
				second: '',
				third: ''
			};
			return _this;
		}

		_createClass(App, [{
			key: '_generate',
			value: function _generate() {
				// Generate a random no.
				return _.random(1, 9);
			}
		}, {
			key: 'render',
			value: function render() {
				var msgClass = 'text-success';

				// Set message color to red if error
				if (this.state.error) {
					msgClass = 'text-danger';
				}

				return React.createElement(
					'div',
					{ className: 'app row' },
					React.createElement(
						'h1',
						null,
						'LOTTERY'
					),
					React.createElement('br', null),
					React.createElement(
						'p',
						{ className: msgClass },
						React.createElement(
							'strong',
							null,
							this.state.message
						)
					),
					React.createElement(
						'form',
						{ className: 'form-inline' },
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('input', { type: 'number', className: 'form-control input-lg', placeholder: 'First Number', value: this.state.first, onChange: this._onNumberChange('first') })
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('input', { type: 'number', className: 'form-control input-lg margin-left', placeholder: 'Second Number', value: this.state.second, onChange: this._onNumberChange('second') })
						),
						React.createElement(
							'div',
							{ className: 'form-group' },
							React.createElement('input', { type: 'number', className: 'form-control input-lg margin-left', placeholder: 'Third Number', value: this.state.third, onChange: this._onNumberChange('third') })
						)
					),
					React.createElement('br', null),
					React.createElement(
						'button',
						{ type: 'button', className: 'btn btn-lg btn-success', onClick: this._onGenerateClick },
						'GENERATE'
					),
					React.createElement(
						'button',
						{ type: 'button', className: 'btn btn-lg btn-success margin-left', onClick: this._onSubmit },
						'SUBMIT'
					)
				);
			}
		}]);

		return App;
	}(React.Component);

	;

	ReactDOM.render(React.createElement(App, null), document.getElementById('react'));

/***/ }
/******/ ]);