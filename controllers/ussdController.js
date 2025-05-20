const sessionModel = require('../models/session');
const transactionModel = require('../models/transaction');

// Menu text in different languages
const menuText = {
  en: {
    welcome: 'Welcome to Academic Info Service',
    languageSelect: 'Select Language:\n1. English\n2. Swahili',
    mainMenu: 'Main Menu:\n1. Course Information\n2. Exam Schedule\n3. Fee Balance\n0. Exit',
    courseMenu: 'Course Information:\n1. Available Courses\n2. Course Requirements\n3. Course Duration\n0. Back',
    examMenu: 'Exam Schedule:\n1. Current Semester\n2. Next Semester\n0. Back',
    feeMenu: 'Fee Information:\n1. Check Balance\n2. Payment Methods\n0. Back',
    invalidInput: 'Invalid input. Please try again.',
    exit: 'Thank you for using our service. Goodbye!'
  },
  sw: {
    welcome: 'Karibu kwenye Huduma ya Taarifa za Elimu',
    languageSelect: 'Chagua Lugha:\n1. Kiingereza\n2. Kiswahili',
    mainMenu: 'Menyu Kuu:\n1. Taarifa za Kozi\n2. Ratiba ya Mitihani\n3. Salio la Ada\n0. Toka',
    courseMenu: 'Taarifa za Kozi:\n1. Kozi Zinazopatikana\n2. Mahitaji ya Kozi\n3. Muda wa Kozi\n0. Rudi',
    examMenu: 'Ratiba ya Mitihani:\n1. Muhula wa Sasa\n2. Muhula Ujao\n0. Rudi',
    feeMenu: 'Taarifa za Ada:\n1. Angalia Salio\n2. Njia za Malipo\n0. Rudi',
    invalidInput: 'Ingizo batili. Tafadhali jaribu tena.',
    exit: 'Asante kwa kutumia huduma yetu. Kwaheri!'
  }
};

// Course information
const courseInfo = {
  en: {
    available: 'Available Courses:\n- Computer Science\n- Business Administration\n- Engineering\n- Medicine',
    requirements: 'Course Requirements:\n- High School Certificate\n- Entrance Exam\n- Application Fee',
    duration: 'Course Duration:\n- Undergraduate: 4 years\n- Masters: 2 years\n- PhD: 3-5 years'
  },
  sw: {
    available: 'Kozi Zinazopatikana:\n- Sayansi ya Kompyuta\n- Utawala wa Biashara\n- Uhandisi\n- Tiba',
    requirements: 'Mahitaji ya Kozi:\n- Cheti cha Shule ya Sekondari\n- Mtihani wa Kuingia\n- Ada ya Maombi',
    duration: 'Muda wa Kozi:\n- Shahada ya Kwanza: Miaka 4\n- Shahada ya Uzamili: Miaka 2\n- Shahada ya Uzamivu: Miaka 3-5'
  }
};

// Exam schedules
const examInfo = {
  en: {
    current: 'Current Semester Exams:\n- Mid-term: October 15-20\n- Finals: December 5-15',
    next: 'Next Semester Exams:\n- Mid-term: March 10-15\n- Finals: May 1-10'
  },
  sw: {
    current: 'Mitihani ya Muhula wa Sasa:\n- Katikati: Oktoba 15-20\n- Mwisho: Desemba 5-15',
    next: 'Mitihani ya Muhula Ujao:\n- Katikati: Machi 10-15\n- Mwisho: Mei 1-10'
  }
};

// Fee information
const feeInfo = {
  en: {
    balance: 'Your current fee balance is $1,500',
    payment: 'Payment Methods:\n- Bank Transfer\n- Mobile Money\n- Online Payment\n- Cash at Cashier'
  },
  sw: {
    balance: 'Salio lako la sasa la ada ni $1,500',
    payment: 'Njia za Malipo:\n- Uhamisho wa Benki\n- Pesa za Simu\n- Malipo ya Mtandaoni\n- Fedha Taslimu kwa Karani'
  }
};

const handleUSSD = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = '';

  try {
    // Create or get session
    await sessionModel.createSession(sessionId, phoneNumber);
    let session = await sessionModel.getSession(sessionId);
    
    // If this is a new session or no language is set
    if (text === '') {
      // Welcome screen with language selection
      response = `CON ${menuText.en.welcome} / ${menuText.sw.welcome}\n${menuText.en.languageSelect}`;
      await sessionModel.updateSession(sessionId, { menuLevel: 1 });
      return res.send(response);
    }

    // Get user input
    const textArray = text.split('*');
    const userInput = textArray[textArray.length - 1];
    const previousInputs = textArray.slice(0, -1).join('*');
    
    // Update session with user input
    await sessionModel.updateSession(sessionId, { userInput: text });
    
    // Re-fetch session to get updated data
    session = await sessionModel.getSession(sessionId);
    
    // Handle language selection (first menu)
    if (textArray.length === 1) {
      const lang = userInput === '1' ? 'en' : userInput === '2' ? 'sw' : null;
      
      if (!lang) {
        response = `CON ${menuText.en.invalidInput}\n${menuText.en.languageSelect}`;
      } else {
        await sessionModel.updateSession(sessionId, { language: lang, menuLevel: 2 });
        response = `CON ${menuText[lang].mainMenu}`;
      }
      return res.send(response);
    }
    
    // Get language from session
    const lang = session.language || 'en';
    
    // Handle main menu selection (second menu)
    if (textArray.length === 2) {
      switch (userInput) {
        case '1':
          response = `CON ${menuText[lang].courseMenu}`;
          await sessionModel.updateSession(sessionId, { menuLevel: 3 });
          break;
        case '2':
          response = `CON ${menuText[lang].examMenu}`;
          await sessionModel.updateSession(sessionId, { menuLevel: 3 });
          break;
        case '3':
          response = `CON ${menuText[lang].feeMenu}`;
          await sessionModel.updateSession(sessionId, { menuLevel: 3 });
          break;
        case '0':
          response = `END ${menuText[lang].exit}`;
          break;
        default:
          response = `CON ${menuText[lang].invalidInput}\n${menuText[lang].mainMenu}`;
          break;
      }
      return res.send(response);
    }
    
    // Handle sub-menu selections (third menu)
    if (textArray.length === 3) {
      const mainMenuChoice = textArray[1];
      
      // Course Information sub-menu
      if (mainMenuChoice === '1') {
        switch (userInput) {
          case '1':
            response = `END ${courseInfo[lang].available}`;
            break;
          case '2':
            response = `END ${courseInfo[lang].requirements}`;
            break;
          case '3':
            response = `END ${courseInfo[lang].duration}`;
            break;
          case '0':
            response = `CON ${menuText[lang].mainMenu}`;
            await sessionModel.updateSession(sessionId, { menuLevel: 2 });
            break;
          default:
            response = `CON ${menuText[lang].invalidInput}\n${menuText[lang].courseMenu}`;
            break;
        }
      }
      
      // Exam Schedule sub-menu
      else if (mainMenuChoice === '2') {
        switch (userInput) {
          case '1':
            response = `END ${examInfo[lang].current}`;
            break;
          case '2':
            response = `END ${examInfo[lang].next}`;
            break;
          case '0':
            response = `CON ${menuText[lang].mainMenu}`;
            await sessionModel.updateSession(sessionId, { menuLevel: 2 });
            break;
          default:
            response = `CON ${menuText[lang].invalidInput}\n${menuText[lang].examMenu}`;
            break;
        }
      }
      
           // Fee Information sub-menu
           else if (mainMenuChoice === '3') {
            switch (userInput) {
              case '1':
                // Record a transaction for balance check
                await transactionModel.createTransaction(phoneNumber, 'balance_check', 0);
                response = `END ${feeInfo[lang].balance}`;
                break;
              case '2':
                response = `END ${feeInfo[lang].payment}`;
                break;
              case '0':
                response = `CON ${menuText[lang].mainMenu}`;
                await sessionModel.updateSession(sessionId, { menuLevel: 2 });
                break;
              default:
                response = `CON ${menuText[lang].invalidInput}\n${menuText[lang].feeMenu}`;
                break;
            }
          }
          
          return res.send(response);
        }
        
        // Default response for any other menu level
        response = `CON ${menuText[lang].invalidInput}\n${menuText[lang].mainMenu}`;
        return res.send(response);
        
      } catch (error) {
        console.error('USSD Error:', error);
        response = 'END An error occurred. Please try again later.';
        return res.send(response);
      }
    };
    
    module.exports = { handleUSSD };
    