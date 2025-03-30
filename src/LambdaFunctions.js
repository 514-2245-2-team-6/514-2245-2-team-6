class LambdaExecutor {
  constructor(apiGatewayBaseUrl) {
    this.apiGatewayBaseUrl = apiGatewayBaseUrl;
  }

  async invokeLambda(endpoint, method = 'POST', body = null) {
    try {
      const response = await fetch(`${this.apiGatewayBaseUrl}/${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.json();
    }
		catch (error) {
      console.error('Lambda invocation failed:', error);
      throw error;
    }
  }

  // Simple method to call the specific Lambda function (e.g., updateCurrentImage)
  async updateCurrentImage(imageData) {
    return this.invokeLambda('updateCurrentImage', 'POST', imageData);
  }

  // Another example: calling getRandomCroppedFace Lambda function
  async getRandomCroppedFace() {
    return this.invokeLambda('getRandomCroppedFace', 'POST');
  }

  // Another example: calling verifyFaceSelection Lambda function
  async verifyFaceSelection(selectionData) {
    return this.invokeLambda('verifyFaceSelection', 'POST', selectionData);
  }
}

export default LambdaExecutor;
