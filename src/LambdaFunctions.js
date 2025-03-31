/**
 * This class encapsulates the logic for invoking Lambda functions using an API Gateway base URL.
 *
 * Example usage:
 * const API_GATEWAY_BASE_URL = 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/dev';
 * const lambdaExecutor = new LambdaExecutor(API_GATEWAY_BASE_URL);
 * const result = await lambdaExecutor.updateCurrentImage(imageData);
 */
class LambdaExecutor {
  constructor(apiGatewayBaseUrl) {
    this.apiGatewayBaseUrl = apiGatewayBaseUrl;
  }

  async invokeLambda(endpoint, body = null) {
    try {
			const requestBody = body ? JSON.stringify(body) : null;
			const url = `${this.apiGatewayBaseUrl}/${endpoint}`;
			const headers = {
				'Content-Type': 'application/json',
			}

			console.log('Request body:', requestBody);
			console.log('Request URL:', url);
			console.log('Request headers:', headers);

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: requestBody
			});


      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

			console.log("Response:", response);

      return await response.json();
    }
		catch (error) {
      console.error('Lambda invocation failed:', error);
      throw error;
    }
  }

  // Simple method to call the specific Lambda function (e.g., updateCurrentImage)
  async updateCurrentImage(imageData) {
    return this.invokeLambda('updateCurrentImage', imageData);
  }

  // Another example: calling getRandomCroppedFace Lambda function
  async getRandomCroppedFace() {
    return this.invokeLambda('getRandomCroppedFace');
  }

  // Another example: calling verifyFaceSelection Lambda function
  async verifyFaceSelection(selectionData) {
    return this.invokeLambda('verifyFaceSelection', selectionData);
  }
}

export default LambdaExecutor;
