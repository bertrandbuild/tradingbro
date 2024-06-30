import { Formik, Form, Field, FieldArray, ErrorMessage, FormikValues } from "formik";
import lighthouse from '@lighthouse-web3/sdk'
import { useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

const CryptoAllocationForm = () => {
  const { address } = useAccount();
  const [apiKey, setApiKey] = useState('');
  const [uploadHash, setUploadHash] = useState('');
  const { signMessageAsync } = useSignMessage();

  const isConnected = address;

  const initialValues = {
    assetManagerName: "",
    favoriteTokens: "",
    image: "",
    notRecommendedTokens: "",
    strategies: [
      {
        name: "",
        riskProfile: "",
        strategyDetails: "",
        assets: [{ symbol: "", name: "", allocationPercentage: "" }],
      },
    ],
  };

  const getLighthouseMessageToSign = () => {
    if (!address) return Promise.reject(new Error('no address'));
    
    const url = `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`;
    
    return fetch(url)
      .then(async response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      });
  };
  
  const getLighthouseApiKey = (signedMessage: string) => {
    if (!address) return Promise.reject(new Error('no address'));
    
    const url = `https://api.lighthouse.storage/api/auth/create_api_key`;
    const data = {
      "publicKey": address,
      "signedMessage": signedMessage,
      "keyName": `tradeWithSatoshi-${address}`,
    };
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      });
  };

  const siwe = async (statement: string) => {
    const domain = window.location.host;
    const origin = window.location.origin;

    const siweMessage = new SiweMessage({
      domain,
      address,
      statement, // ie : the message to sign
      uri: origin,
      version: '1',
      chainId: 1,
    });

    const messageToSign = siweMessage.prepareMessage();
    return await signMessageAsync({ message: messageToSign });
  }

  const createNewApiKey = async () => {
    try {
      const messageToSign = await getLighthouseMessageToSign();
      const signedMessage = await siwe(messageToSign);
      const apiKey = await getLighthouseApiKey(signedMessage);

      setApiKey(apiKey);
    } catch (error) {
      console.error('There was a problem fetching the API key:', error);
    }
  }
  
  const onSubmit = async (values: FormikValues) => {
    if (!apiKey) throw new Error("Api key is missing");
    try {
      const response = await lighthouse.uploadText(JSON.stringify(values), apiKey, values.assetManagerName)
      console.log(response);
      setUploadHash(response.data.Hash)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-base-100 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Crypto Allocation Form</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="assetManagerName" className="block font-medium">
                Asset Manager Name
              </label>
              <Field
                id="assetManagerName"
                name="assetManagerName"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="assetManagerName"
                component="div"
                className="text-red-600"
              />
            </div>

            <div>
              <label htmlFor="favoriteTokens" className="block font-medium">
                Favorite Tokens
              </label>
              <Field
                id="favoriteTokens"
                name="favoriteTokens"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="favoriteTokens"
                component="div"
                className="text-red-600"
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block font-medium">
                Image Url
              </label>
              <Field
                id="image"
                name="image"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="notRecommendedTokens"
                className="block font-medium"
              >
                Not Recommended Tokens
              </label>
              <Field
                id="notRecommendedTokens"
                name="notRecommendedTokens"
                type="text"
                className="input input-bordered w-full"
              />
              <ErrorMessage
                name="notRecommendedTokens"
                component="div"
                className="text-red-600"
              />
            </div>

            <FieldArray name="strategies">
              {({ remove, push }) => (
                <div className="space-y-4 bg-base-200 p-4 rounded-md">
                  {values.strategies.map((strategy, index) => (
                    <div key={index} className="rounded-md space-y-4">
                      <h3 className="text-lg font-medium mb-2">
                        Strategy {index + 1}
                      </h3>

                      <div>
                        <label
                          htmlFor={`strategies.${index}.name`}
                          className="block font-medium"
                        >
                          Strategy Name
                        </label>
                        <Field
                          id={`strategies.${index}.name`}
                          name={`strategies.${index}.name`}
                          type="text"
                          className="input input-bordered w-full"
                        />
                        <ErrorMessage
                          name={`strategies.${index}.name`}
                          component="div"
                          className="text-red-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`strategies.${index}.riskProfile`}
                          className="block font-medium"
                        >
                          Risk Profile
                        </label>
                        <Field
                          id={`strategies.${index}.riskProfile`}
                          name={`strategies.${index}.riskProfile`}
                          as="select"
                          className="select select-bordered w-full"
                        >
                          <option value="">Select Risk Profile</option>
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                        </Field>
                        <ErrorMessage
                          name={`strategies.${index}.riskProfile`}
                          component="div"
                          className="text-red-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="strategyDetails"
                          className="block font-medium"
                        >
                          Strategy Details
                        </label>
                        <Field
                          id="strategyDetails"
                          name="strategyDetails"
                          as="textarea"
                          className="textarea textarea-bordered w-full"
                        />
                        <ErrorMessage
                          name="strategyDetails"
                          component="div"
                          className="text-red-600"
                        />
                      </div>

                      <FieldArray name={`strategies.${index}.assets`}>
                        {({ remove: removeAsset, push: pushAsset }) => (
                          <div className="space-y-4">
                            {strategy.assets.map((asset, assetIndex) => (
                              <div
                                key={assetIndex}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div>
                                  <label
                                    htmlFor={`strategies.${index}.assets.${assetIndex}.symbol`}
                                    className="block font-medium"
                                  >
                                    Asset Symbol
                                  </label>
                                  <Field
                                    id={`strategies.${index}.assets.${assetIndex}.symbol`}
                                    name={`strategies.${index}.assets.${assetIndex}.symbol`}
                                    type="text"
                                    className="input input-bordered w-full"
                                  />
                                  <ErrorMessage
                                    name={`strategies.${index}.assets.${assetIndex}.symbol`}
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`strategies.${index}.assets.${assetIndex}.name`}
                                    className="block font-medium"
                                  >
                                    Asset Name
                                  </label>
                                  <Field
                                    id={`strategies.${index}.assets.${assetIndex}.name`}
                                    name={`strategies.${index}.assets.${assetIndex}.name`}
                                    type="text"
                                    className="input input-bordered w-full"
                                  />
                                  <ErrorMessage
                                    name={`strategies.${index}.assets.${assetIndex}.name`}
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`strategies.${index}.assets.${assetIndex}.allocationPercentage`}
                                    className="block font-medium"
                                  >
                                    Allocation Percentage
                                  </label>
                                  <Field
                                    id={`strategies.${index}.assets.${assetIndex}.allocationPercentage`}
                                    name={`strategies.${index}.assets.${assetIndex}.allocationPercentage`}
                                    type="number"
                                    step="0.01"
                                    className="input input-bordered w-full"
                                  />
                                  <ErrorMessage
                                    name={`strategies.${index}.assets.${assetIndex}.allocationPercentage`}
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>

                                <div className="flex justify-center align-middle">
                                  <button
                                    type="button"
                                    className={`btn btn-error mt-6 mr-4 ${assetIndex==0?'hidden':''}`}
                                    onClick={() => removeAsset(assetIndex)}
                                  >
                                    Remove Asset
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary mt-6"
                                    onClick={() =>
                                      pushAsset({
                                        symbol: "",
                                        name: "",
                                        allocationPercentage: "",
                                      })
                                    }
                                  >
                                    Add Asset
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>

                      <button
                        type="button"
                        className={`btn btn-error mt-4 mr-4 ${index==0?'hidden':''}`}
                        onClick={() => remove(index)}
                      >
                        Remove Strategy
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary mt-2"
                        onClick={() =>
                          push({
                            name: "",
                            assets: [
                              {
                                symbol: "",
                                name: "",
                                allocationPercentage: "",
                              },
                            ],
                            riskProfile: "",
                            rationale: "",
                          })
                        }
                      >
                        Add Strategy
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {!isConnected && 
              <div className="flex justify-center align-middle items-center">
                <w3m-button label="Connect to add a new strategy"/>
              </div>
            }
            {isConnected &&
            <div className="flex flex-col pt-8">
              <label htmlFor="apikey" className="block font-medium">
                Lighthouse api key 
              </label>
              <div className="flex justify-center align-middle items-center">
                <Field
                  id="apikey"
                  name="apikey"
                  type="text"
                  className="input input-bordered w-3/4"
                  value={apiKey || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setApiKey(e.target.value || '');
                  }}
                  />
                <button
                  type="button"
                  className="btn btn-secondary w-1/4 mx-4 flex"
                  onClick={createNewApiKey}
                  >
                  Create a new lighthouse api key
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-1/4 mx-auto flex"
                  disabled={!apiKey}
                  >
                  Submit
                </button>
              </div>
              <span className="prose prose-sm text-neutral-500">Lighthouse uses Filecoin to manage access rights,<br/> learn more on <a className="text-neutral-600" href="https://lighthouse.storage" target="_blank" rel="noopener noreferrer">lighthouse.storage</a></span>
              {uploadHash && 
                <span className="prose">Your strategy has been successfuly uploaded 🎉<br/> <a href={`./?hash=${uploadHash}`}>Test it now</a></span>
              }
            </div>
            }

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CryptoAllocationForm;

