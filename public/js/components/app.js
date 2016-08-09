// Include the CSRF TOKEN for every post requests
$.ajaxSetup({
    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
});

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			message: '',
			first: '',
			second: '',
			third: ''
		};
	}

	_onNumberChange = (pos) => (event) => {
		const val = event.target.value;

		// Do not allow for values lesser than 1 or more than 9
		if ( ! val == '' ) {
			if (val < 1 || val > 9 || val == this.state.first || val == this.state.second || val == this.state.third) {
				return;
			}
		}
	
		this.setState({[pos]: val});
	}

	_onGenerateClick = () => {
		let first = this._generate();
		let second = '';
		let third = '';

		let generatedNo = this._generate();

		while (generatedNo === first) {
			generatedNo = this._generate();
		}
		second = generatedNo;

		while (generatedNo === first || generatedNo === second) {
			generatedNo = this._generate();
		}
		third = generatedNo;

		this.setState({
			first: first,
			second: second,
			third: third
		});
	}

	_generate() {
		// Generate a random no.
		return _.random(1, 9);
	}

	_onSubmit = () => {
		const first = this.state.first;
		const second = this.state.second;
		const third = this.state.third;

		// Check for empty fields
		if (s.isBlank(first) || s.isBlank(second) || s.isBlank(third)) {
			alert('One of the field is empty!');
			return;
		}

		this.setState({error: false, message: 'Please wait...'});
		
		const data = {first, second, third};

		// Request
		$.ajax({
			url: '/lottery_numbers',
			type: 'POST',
			data: data,
			success: function(response) {
				if (response.success) {
					this.setState({error: false, message: 'Success!', first: '', second: '', third: ''});
				} else {
					if (response.error_code == 2) {
						this.setState({error: true, message: response.message});
					} else if (response.error_code == 3) {
						let date = moment.utc(response.date_selected).local().format('MMM DD, YYYY hh:mm A');
						this.setState({error: true, message: `${response.message} Last Selected On: ${date}`});
					}
					
				}
			}.bind(this),
			error: function(data) {
				const errors = data.responseJSON;
        		console.log(errors);
			}.bind(this)
		});
	}

	render() {
		let msgClass = 'text-success';

		// Set message color to red if error
		if (this.state.error) {
			msgClass = 'text-danger';
		}

		return (
			<div className="app row">
				<h1>LOTTERY</h1>
				<br />
				<p className={msgClass}><strong>{this.state.message}</strong></p>
				<form className="form-inline">
					<div className="form-group">
			    		<input type="number" className="form-control input-lg" placeholder="First Number" value={this.state.first} onChange={this._onNumberChange('first')} />
	  				</div>
	  				<div className="form-group">
				    	<input type="number" className="form-control input-lg margin-left" placeholder="Second Number" value={this.state.second} onChange={this._onNumberChange('second')} />
	  				</div>
	  				<div className="form-group">
				    	<input type="number" className="form-control input-lg margin-left" placeholder="Third Number" value={this.state.third} onChange={this._onNumberChange('third')} />
	  				</div>
				</form>
				<br />
  				<button type="button" className="btn btn-lg btn-success" onClick={this._onGenerateClick}>GENERATE</button>
  				<button type="button" className="btn btn-lg btn-success margin-left" onClick={this._onSubmit}>SUBMIT</button>
			</div>
		);
	}
};

ReactDOM.render(
	<App />,
	document.getElementById('react')
);