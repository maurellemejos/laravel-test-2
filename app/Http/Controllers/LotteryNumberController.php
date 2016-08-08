<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\LotteryNumber;
use Illuminate\Http\Request;

class LotteryNumberController extends Controller
{
    public function saveNumbers(Request $request) {
    	// Default response
    	$response = [
    		'success' => false
    	];

    	$min = 1; // Min no. allowed
    	$max = 9; // Max no. allowed

    	$first = $request->input('first');
    	$second = $request->input('second');
    	$third = $request->input('third');

    	// Check if sent inputs are empty
    	if (empty($first) || empty($second) || empty($third)) {
    		$response['message'] = 'One of the required fields is empty';
    		return response()->json($response);
    	}
    	// Check if one of the numbers exceeds the min or max allowed number
    	if (($first < $min || $first > $max) || ($second < $min || $second > $max) || ($third < $min || $third > $max)) {
    		$response['message'] = 'One of the numbers is invalid.';
    		return response()->json($response);
    	}

    	$numbers = [
    		$request->input('first'),
    		$request->input('second'),
    		$request->input('third'),
    	];

    	// Check is the combination already exists
    	$matched = LotteryNumber::where(function($query) use ($numbers) {
    						$query->whereRaw("FIND_IN_SET($numbers[0], numbers) > 0")
    							->whereRaw("FIND_IN_SET($numbers[1], numbers) > 0")
    							->whereRaw("FIND_IN_SET($numbers[2], numbers) > 0");
    					})
    					->first();

    	// If not, save the combination and send a success message
    	// Otherwise, send an error message indicating it has been selected
    	if (is_null($matched)) {
    		LotteryNumber::create([
    			'numbers' => implode(',', $numbers)
    		]);
    		$response['success'] = true;

    		return response()->json($response);
    	} else {
    		// Update the timestamp of this combination
    		$matched->touch();
    		// Set the error message and date last selected
    		$response['message'] = 'Sorry, the number combination has already been selected before.';
    		$response['date_selected'] = $matched->updated_at->toDateTimeString();

    		return response()->json($response);
    	}
    }
}
