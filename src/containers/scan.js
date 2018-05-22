//////////////////////////////////////////////////
// https://github.com/BlinkID/blinkid-phonegap //
/////////////////////////////////////////////////

/**
 * Use these scanner types
 * Available: "PDF417", "USDL", "Barcode", "MRTD", "EUDL", "UKDL", "DEDL", "MyKadFront", "MyKadBack", "IKad", "MyTentera", "GermanOldID", "GermanIDFront", "GermanIDBack", "GermanPassport", "UnitedArabEmiratesIDFront", "UnitedArabEmiratesIDBack", "SingaporeIDFront", "SingaporeIDBack", "IndonesiaID", "DocumentFace", "DocumentDetector"
 * PDF417 - scans PDF417 barcodes
 * USDL - scans barcodes located on the back of US driver's license
 * Barcode - scans various types of codes (i.e. QR, UPCA, UPCE...). Types of scanned codes can be modified in plugin classes (Explained later in this readme). By default, scanned codes are set to: Code 39, Code 128, EAN 13, EAN 8, QR, UPCA, UPCE
 * MRTD - scans Machine Readable Travel Document, contained in various IDs and passports
 * EUDL - scans the front side of European driver's license
 * UKDL - scans the front side of United Kingom driver's license
 * DEDL - scans the front side of German driver's license
 * MyKadFront - scans the front side of Malaysian ID card
 * MyKadBack - scans the back side of Malaysian ID card
 * IKad - scans the front side of IKad card
 * MyTentera - scans the front side of Malaysian Tentera card
 * GermanOldID - scans the front side of old German ID card
 * GermanIDFront - scans the front side of German ID card
 * GermanIDBack - scans the back side of German ID card
 * GermanPassport - scans the front side of German passport
 * UnitedArabEmiratesIDFront - scans the front side of UnitedArabEmirates ID card
 * UnitedArabEmiratesIDBack - scans the back side of UnitedArabEmirates ID card
 * SingaporeIDFront - scans the front side of Singapore ID card
 * SingaporeIDBack - scans the back side of Singapore ID card
 * IndonesiaID - scans the front side of Indonesia ID card
 * DocumentFace - scans documents which contain owner's face image
 * DocumentDetector - scans documents that are specified as ID1 or ID2 and returns their image
 *
 * Variable << types >> declared below has to contain all the scanners needed by your application. Applying additional scanners will slow down the scanning process
 */
const types = ["PDF417", "MRTD", "Barcode"];

/**
 * Image type defines type of the image that will be returned in scan result (image is returned as Base64 encoded JPEG)
 * available:
 *  empty - do not return any images - IMPORTANT : THIS IMPROVES SCANNING SPEED!
 *  "IMAGE_SUCCESSFUL_SCAN" : return full camera frame of successful scan
 *  "IMAGE_DOCUMENT" : return cropped document image
 *  "IMAGE_FACE" : return image of the face from the ID
 */
const imageTypes = ["IMAGE_DOCUMENT"];
// const imageTypes = ["IMAGE_SUCCESSFUL_SCAN", "IMAGE_FACE", "IMAGE_DOCUMENT"];

/**
* Language to be used in the scanning UI
* Available:
*  - English: "en"
*  - Croatian: "hr"
*/
const language = "en"

// Note that each platform requires its own license key

// This license key allows setting overlay views for this application ID: com.microblink.blinkid
const licenseiOs = "UG4BDCB2-KRGRNSUK-P4UP3UH7-ZI3WIGZH-LCVQAJKI-U4V365WC-2RZPCNNU-GFWE7V3T"; // valid until 2018-08-07

// This license is only valid for package name "com.microblink.blinkid"
const licenseAndroid = "FESCWEBI-3FQIPFNN-UOA3DVXD-CARRDWLE-P7SQBC3D-V3PZU4SX-54PGVNWO-NQ5WS5HX";

export default () => {
  return new Promise((resolve, reject) => {
    cordova.plugins.blinkIdScanner.scan(
      // Register the callback handler
      callback,
      // Register the error callback
      (err) => reject('Error: ' + err),
      // Options
      types, imageTypes, licenseiOs, licenseAndroid, language
    );

    function callback(scanningResult) {
      console.log('callback --> ', JSON.stringify(scanningResult, null, 2));
      const resultDiv = {};
      const result = [];
      // handle cancelled scanning
      if (scanningResult.cancelled == true) {
          resultDiv.innerHTML = "Cancelled!";
          resolve(resultDiv);
          return;
      }
      
      // Obtain list of recognizer results
      var resultList = scanningResult.resultList;
      
      const successfulImageDiv = {
        style: {},
      };
      const documentImageDiv = {
        style: {},
      };
      const faceImageDiv = {
        style: {},
      };

      successfulImageDiv.style.visibility = "hidden"
      documentImageDiv.style.visibility = "hidden"
      faceImageDiv.style.visibility = "hidden"

      // Image is returned as Base64 encoded JPEG
      var image = scanningResult.resultImage;

      // Successful image is returned as Base64 encoded JPEG
      var resultSuccessfulImage = scanningResult.resultSuccessfulImage;
      if (resultSuccessfulImage) {
          successfulImage.src = "data:image/jpg;base64, " + resultSuccessfulImage;
          successfulImageDiv.style.visibility = "visible"
      }
      // Iterate through all results
      for (var i = 0; i < resultList.length; i++) {
        // Get individual resilt
        var recognizerResult = resultList[i];
        var fields = recognizerResult.fields;

        if (recognizerResult.resultType == "Barcode result") {
            // handle Barcode scanning result

            var raw = "";
            if (typeof(recognizerResult.raw) != "undefined" && recognizerResult.raw != null) {
                raw = " (raw: " + hex2a(recognizerResult.raw) + ")";
            }
            resultDiv.innerHTML = "Data: " + recognizerResult.data +
                                raw +
                                " (Type: " + recognizerResult.type + ")";

        } else if (recognizerResult.resultType == "USDL result") {
            // handle USDL parsing result

            resultDiv.innerHTML = /** Personal information */
                                "USDL version: " + fields[kPPStandardVersionNumber] + "<br>" +
                                "Family name: " + fields[kPPCustomerFamilyName] + "<br>" +
                                "First name: " + fields[kPPCustomerFirstName] + "<br>" +
                                "Date of birth: " + fields[kPPDateOfBirth] + "<br>" +
                                "Sex: " + fields[kPPSex] + "<br>" +
                                "Eye color: " + fields[kPPEyeColor] + "<br>" +
                                "Height: " + fields[kPPHeight] + "<br>" +
                                "Street: " + fields[kPPAddressStreet] + "<br>" +
                                "City: " + fields[kPPAddressCity] + "<br>" +
                                "Jurisdiction: " + fields[kPPAddressJurisdictionCode] + "<br>" +
                                "Postal code: " + fields[kPPAddressPostalCode] + "<br>" +

                                /** License information */
                                "Issue date: " + fields[kPPDocumentIssueDate] + "<br>" +
                                "Expiration date: " + fields[kPPDocumentExpirationDate] + "<br>" +
                                "Issuer ID: " + fields[kPPIssuerIdentificationNumber] + "<br>" +
                                "Jurisdiction version: " + fields[kPPJurisdictionVersionNumber] + "<br>" +
                                "Vehicle class: " + fields[kPPJurisdictionVehicleClass] + "<br>" +
                                "Restrictions: " + fields[kPPJurisdictionRestrictionCodes] + "<br>" +
                                "Endorsments: " + fields[kPPJurisdictionEndorsementCodes] + "<br>" +
                                "Customer ID: " + fields[kPPCustomerIdNumber] + "<br>";

        } else if (recognizerResult.resultType == "MRTD result" || recognizerResult.resultType == "UnitedArabEmiratesIDBack result") {
          // UnitedArabEmiratesIDBack result contains only fields from the MRZ (Machine Readable Zone)
          const item = {
            PrimaryId: fields.PrimaryId || undefined,
            SecondaryId: fields.SecondaryId || undefined,
            DateOfBirth: fields.DateOfBirth || undefined,
            Sex: fields.Sex || undefined,
            Nationality: fields.Nationality || undefined,
            ImmigrantCaseNumber: fields.ImmigrantCaseNumber || undefined,
            DateOfExpiry: fields.DateOfExpiry || undefined,
            DocumentCode: fields.DocumentCode || undefined,
            DocumentNumber: fields.DocumentNumber || undefined,
            Issuer: fields.Issuer || undefined,
            PaymentDataType: fields.PaymentDataType || undefined,
            Opt1: fields.Opt1 || undefined,
            Opt2: fields.Opt2 || undefined,
            MRTDRaw: fields.MRTDRaw || undefined,
            image: recognizerResult.resultDocumentImage || undefined,
          }
          result.push(item);

          resultDiv.innerHTML = /** Personal information */
                              "Type: MRTD<br>" +
                              "Family name: " + fields["PrimaryId"] + "<br>" +
                              "First name: " + fields["SecondaryId"] + "<br>" +
                              "Date of birth: " + fields["DateOfBirth"] + "<br>" +
                              "Sex: " + fields["Sex"] + "<br>" +
                              "Nationality: " + fields["Nationality"] + "<br>" +
                              "ImmigrantCaseNumber: " + (fields["ImmigrantCaseNumber"] || "none") + "<br>" +
                              "Date of Expiry: " + fields["DateOfExpiry"] + "<br>" +
                              "Document Code: " + fields["DocumentCode"] + "<br>" +
                              "Document Number: " + fields["DocumentNumber"] + "<br>" +
                              "Issuer: " + fields["Issuer"] + "<br>" +
                              "ID Type: " + fields["PaymentDataType"] + "<br>" +
                              "Opt1: " + fields["Opt1"] + "<br>" +
                              "Opt2: " + fields["Opt2"] + "<br>" +
                              "MRTDRaw: " + fields["MRTDRaw"] + "<br>";
          if (recognizerResult.resultDocumentImage) {
            resultDiv.innerHTML += `<img src="data:image/png;base64, ${recognizerResult.resultDocumentImage}" />`;
          }
        } else if (recognizerResult.resultType == "EUDL result" || recognizerResult.resultType == "UKDL result" || recognizerResult.resultType == "DEDL result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Date of Expiry: " + fields[kPPeudlExpiry] + "<br>" +
                                "Issue Date: " + fields[kPPeudlIssueDate] + "<br>" +
                                "Issuing Authority: " + fields[kPPeudlIssuingAuthority] + "<br>" +
                                "Driver Number: " + fields[kPPeudlDriverNumber] + "<br>" +
                                "Address: " + fields[kPPeudlAddress] + "<br>" +
                                "Birth Data: " + fields[kPPeudlBirthData] + "<br>" +
                                "First name: " + fields[kPPeudlFirstName] + "<br>" +
                                "Last name: " + fields[kPPeudlLastName] + "<br>";

        } else if (recognizerResult.resultType == "MyKadFront result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "NRIC Number: " + fields[kPPmyKadNricNumber] + "<br>" +
                                "Address: " + fields[kPPmyKadAddress] + "<br>" +
                                "Address ZIP Code: " + fields[kPPmyKadAddressZipCode] + "<br>" +
                                "Address Street: " + fields[kPPmyKadAddressStreet] + "<br>" +
                                "Address City: " + fields[kPPmyKadAddressCity] + "<br>" +
                                "Address State: " + fields[kPPmyKadAddressState] + "<br>" +
                                "Birth Date: " + fields[kPPmyKadBirthDate] + "<br>" +
                                "Full Name: " + fields[kPPmyKadFullName] + "<br>" +
                                "Religion: " + fields[kPPmyKadReligion] + "<br>" +
                                "Sex: " + fields[kPPmyKadSex] + "<br>";

        } else if (recognizerResult.resultType == "MyKadBack result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "NRIC Number: " + fields[kPPmyKadBackNricNumber] + "<br>" +
                                "Extended NRIC Number: " + fields[kPPmyKadBackExtendedNricNumber] + "<br>" +
                                "Birth Date: " + fields[kPPmyKadBackBirthDate] + "<br>" +
                                "Sex: " + fields[kPPmyKadBackSex] + "<br>";

        } else if (recognizerResult.resultType == "MyTentera result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Army Number: " + fields[kPPmyTenteraArmyNumber] + "<br>" +
                                "NRIC Number: " + fields[kPPmyTenteraNricNumber] + "<br>" +
                                "Address: " + fields[kPPmyTenteraAddress] + "<br>" +
                                "Address ZIP Code: " + fields[kPPmyTenteraAddressZipCode] + "<br>" +
                                "Address Street: " + fields[kPPmyTenteraAddressStreet] + "<br>" +
                                "Address City: " + fields[kPPmyTenteraAddressCity] + "<br>" +
                                "Address State: " + fields[kPPmyTenteraAddressState] + "<br>" +
                                "Birth Date: " + fields[kPPmyTenteraBirthDate] + "<br>" +
                                "Full Name: " + fields[kPPmyTenteraFullName] + "<br>" +
                                "Religion: " + fields[kPPmyTenteraReligion] + "<br>" +
                                "Sex: " + fields[kPPmyTenteraSex] + "<br>";

        } else if (recognizerResult.resultType == "IKad result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Address: " + fields[kPPiKadAddress] + "<br>" +
                                "Birth Date: " + fields[kPPiKadDateOfBirth] + "<br>" +
                                "Employer: " + fields[kPPiKadEmployer] + "<br>" +
                                "Expiry Date: " + fields[kPPiKadExpiryDate] + "<br>" +
                                "Name: " + fields[kPPiKadName] + "<br>" +
                                "Nationality: " + fields[kPPiKadNationality] + "<br>" +
                                "Passport Number: " + fields[kPPiKadPassportNumber] + "<br>" +
                                "Sector: " + fields[kPPiKadSector] + "<br>" +
                                "Sex: " + fields[kPPiKadSex] + "<br>";

        } else if (recognizerResult.resultType == "GermanOldID result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Family name: " + fields[kPPmrtdPrimaryId] + "<br>" +
                                "First name: " + fields[kPPmrtdSecondaryId] + "<br>" +
                                "Date of Expiry: " + fields[kPPmrtdExpiry] + "<br>" +
                                "Date of birth: " + fields[kPPmrtdBirthDate] + "<br>" +
                                "Nationality: " + fields[kPPmrtdNationality] + "<br>" +
                                "Document Code: " + fields[kPPmrtdDocCode] + "<br>" +
                                "Document Number: " + fields[kPPmrtdDocNumber] + "<br>" +
                                "Issuer: " + fields[kPPmrtdIssuer] + "<br>" +
                                "Place of birth: " + fields[kPPgermanIdBirthPlace] + "<br>";

        } else if (recognizerResult.resultType == "GermanFrontID result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Last name: " + fields[kPPgermanIdLastName] + "<br>" +
                                "First name: " + fields[kPPgermanIdFirstName] + "<br>" +
                                "Date of birth: " + fields[kPPgermanIdBirthDate] + "<br>" +
                                "Place of birth: " + fields[kPPgermanIdBirthPlace] + "<br>" +
                                "Nationality: " + fields[kPPgermanIdNationality] + "<br>" +
                                "Date of expiry: " + fields[kPPgermanIdExpiryDate] + "<br>" +
                                "Card number: " + fields[kPPgermanIdCardNumber] + "<br>";

        } else if (recognizerResult.resultType == "GermanBackID result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Colour of eyes: " + fields[kPPgermanIdEyeColour] + "<br>" +
                                "Height: " + fields[kPPgermanIdHeight] + "<br>" +
                                "Issue date: " + fields[kPPgermanIdIssueDate] + "<br>" +
                                "Issuing authority: " + fields[kPPgermanIdIssuingAuthority] + "<br>" +
                                "Address: " + fields[kPPgermanIdAddress] + "<br>";

        } else if (recognizerResult.resultType == "GermanPassport result") {

            resultDiv.innerHTML = /** Personal information */
                                "Type: " + fields[kPPDataType] + "<br>" +
                                "Passport number: " + fields[kPPmrtdDocNumber] + "<br>" +
                                "Surname: " + fields[kPPgermanPassSurname] + "<br>" +
                                "Name: " + fields[kPPgermanPassName] + "<br>" +
                                "Nationality: " + fields[kPPgermanPassNationality] + "<br>" +
                                "Date of birth: " + fields[kPPmrtdBirthDate] + "<br>" +
                                "Sex: " + fields[kPPmrtdSex] + "<br>" +
                                "Place of birth: " + fields[kPPgermanPassBirthPlace] + "<br>" +
                                "Date of issue: " + fields[kPPgermanPassIssueDate] + "<br>" +
                                "Date of expiry: " + fields[kPPmrtdExpiry] + "<br>" +
                                "Authority: " + fields[kPPgermanPassIssuingAuthority] + "<br>";

        } else if (recognizerResult.resultType == "UnitedArabEmiratesIDFront result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "ID number: " + fields[kPPuaeIdFrontIdNumber] + "<br>" +
                                "Name: " + fields[kPPuaeIdFrontName] + "<br>" +
                                "Nationality: " + fields[kPPuaeIdFrontNationality] + "<br>";

        } else if (recognizerResult.resultType == "SingaporeFrontID result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Card number: " + fields[kPPsingaporeCardNumberFront] + "<br>" +
                                "Date of birth: " + fields[kPPsingaporeDateOfBirth] + "<br>" +
                                "Country of birth: " + fields[kPPsingaporeCountryOfBirth] + "<br>" +
                                "Race: " + fields[kPPsingaporeRace] + "<br>" +
                                "Name: " + fields[kPPsingaporeName] + "<br>" +
                                "Sex: " + fields[kPPsingaporeSex] + "<br>";

        } else if (recognizerResult.resultType == "SingaporeBackID result") {

            resultDiv.innerHTML = /** Personal information */
                                "ID Type: " + fields[kPPDataType] + "<br>" +
                                "Card number: " + fields[kPPsingaporeCardNumberBack] + "<br>" +
                                "Date of issue: " + fields[kPPsingaporeDateOfIssue] + "<br>" +
                                "Blood group: " + fields[kPPsingaporeBloodGroup] + "<br>" +
                                "Address: " + fields[kPPsingaporeAddress] + "<br>";

        } else if (recognizerResult.resultType == "IndonesiaID result") {
            resultDiv.innerHTML =
                                "Document number: " + fields[kPPindonesiaDocumentNumber] + "<br>" +
                                "Name: " + fields[kPPindonesiaName] + "<br>" +
                                "Occupation: " + fields[kPPindonesiaOccupation] + "<br>" +
                                "Martial status: " + fields[kPPindonesiaMartialStatus] + "<br>" +
                                "Date of birth: " + fields[kPPindonesiaDateOfBirth] + "<br>" +
                                "Blood type: " + fields[kPPindonesiaBloodType] + "<br>" +
                                "Religion: " + fields[kPPindonesiaReligion] + "<br>" +
                                "Sex: " + fields[kPPindonesiaSex] + "<br>" +
                                "Citizenship: " + fields[kPPindonesiaCitizenship] + "<br>" +
                                "Valid until: " + fields[kPPindonesiaValidUntil] + "<br>" +
                                "Place of birth: " + fields[kPPindonesiaPlaceOfBirth] + "<br>" +
                                "Province: " + fields[kPPindonesiaProvince] + "<br>" +
                                "District: " + fields[kPPindonesiaDistrict] + "<br>" +
                                "City: " + fields[kPPindonesiaCity] + "<br>" +
                                "KelDesa: " + fields[kPPindonesiaKelDesa] + "<br>" +
                                "Address: " + fields[kPPindonesiaAddress] + "<br>" +
                                "RT: " + fields[kPPindonesiaRT] + "<br>" +
                                "RW: " + fields[kPPindonesiaRW] + "<br>";

        } else if (recognizerResult.resultType == "DocumentDetector result") {

            resultDiv.innerHTML = "Found a document";

        } else if (recognizerResult.resultType == "DocumentFace result") {

            resultDiv.innerHTML = "Found document with face";

        } else {
            
            resultDiv.innerHTML = recognizerResult.resultType;

        }

        // Document image is returned as Base64 encoded JPEG
        // var resultDocumentImage = recognizerResult.resultDocumentImage;
        // if (resultDocumentImage) {
        //     documentImage.src = "data:image/jpg;base64, " + resultDocumentImage;
        //     documentImageDiv.style.visibility = "visible"
        // } else {
        //     documentImageDiv.style.visibility = "hidden"
        // }

        // Face image is returned as Base64 encoded JPEG
        // var resultFaceImage = recognizerResult.resultFaceImage;
        // if (resultFaceImage) {
        //     faceImage.src = "data:image/jpg;base64, " + resultFaceImage;
        //     faceImageDiv.style.visibility = "visible"
        // } else {
        //     faceImageDiv.style.visibility = "hidden"
        // }
      }
      console.log('result --> ', JSON.stringify(result, null, 2));      
      resolve(result);
    }
  });
}
