const sessionModel = require('../models/session');
const transactionModel = require('../models/transaction');

// Menu text in different languages
const menuText = {
  en: {
    welcome: 'Welcome to Academic Info Service',
    languageSelect: 'Select Language:\n1. English\n2. Kinyarwanda',
    mainMenu: 'Main Menu:\n1. Course Information\n2. Exam Schedule\n3. Fee Balance\n0. Exit',
    courseMenu: 'Course Information:\n1. Available Courses\n2. Course Requirements\n3. Course Duration\n0. Back',
    examMenu: 'Exam Schedule:\n1. Current Semester\n2. Next Semester\n0. Back',
    feeMenu: 'Fee Information:\n1. Check Balance\n2. Payment Methods\n0. Back',
    invalidInput: 'Invalid input. Please try again.',
    exit: 'Thank you for using our service. Goodbye!'
  },
  sw: {
    welcome: 'Murakaza neza muri serivisi y`amakuru y`uburezi',
    languageSelect: 'Hitamo ururimi:\n1. Icyongereza\n2. Ikinyarwanda',
    mainMenu: 'Ibikubiye muri menu:\n1. Amakuru y`amasomo\n2. Gahunda y`ibizamini\n3. Asigaye mu mafagitire\n0. Gusohoka',
    courseMenu: 'Amakuru y`amasomo:\n1. Amasomo aboneka\n2. Ibisabwa mu kwiga\n3. Igihe bimara\n0. Gusubira inyuma',
    examMenu: 'Gahunda y`ibizamini:\n1. Igihembwe kiriho\n2. Igihembwe gitaha\n0. Gusubira inyuma',
    feeMenu: 'Amakuru y`amafaranga:\n1. Kureba asigaye\n2. Uburyo bwo kwishyura\n0. Gusubira inyuma',
    invalidInput: 'Ibyo wanditse ntibemewe. Ongera ugerageze.',
    exit: 'Urakoze gukoresha serivisi yacu. Murabeho!'
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
    available: 'Amasomo aboneka:\n- Ubuhanga bwa mudasobwa\n- Ubuyobozi bw`ubucuruzi\n- Ubuhanga\n- Ubuvuzi',
    requirements: 'Ibisabwa mu kwiga:\n- Impamyabumenyi y`amashuri yisumbuye\n- Ikizamini cyo kwinjira\n- Amafaranga yo kwiyandikisha',
    duration: 'Igihe bimara:\n- Impamyabumenyi ya mbere: Imyaka 4\n- Impamyabumenyi y`urwego rwo hejuru: Imyaka 2\n- Impamyabumenyi y`ubushakashatsi: Imyaka 3-5'
  }
};

// Exam schedules
const examInfo = {
  en: {
    current: 'Current Semester Exams:\n- Mid-term: October 15-20\n- Finals: December 5-15',
    next: 'Next Semester Exams:\n- Mid-term: March 10-15\n- Finals: May 1-10'
  },
  sw: {
    current: 'Ibizamini by`igihembwe kiriho:\n- Hagati: Ukwakira 15-20\n- Impera: Ukuboza 5-15',
    next: 'Ibizamini by`igihembwe gitaha:\n- Hagati: Werurwe 10-15\n- Impera: Gicurasi 1-10'
  }
};

// Fee information
const feeInfo = {
  en: {
    balance: 'Your current fee balance is $1,500',
    payment: 'Payment Methods:\n- Bank Transfer\n- Mobile Money\n- Online Payment\n- Cash at Cashier'
  },
  sw: {
    balance: 'Amafaranga asigaye ni $1,500',
    payment: 'Uburyo bwo kwishyura:\n- Kohereza mu ibanki\n- Amafaranga kuri telefoni\n- Kwishyura kuri interineti\n- Amafaranga ku mwanditsi w`ibaruramari'
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
    