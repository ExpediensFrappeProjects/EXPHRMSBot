from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from rasa_sdk.events import FollowupAction
import requests
import urllib.parse


class ActionClearSlot(Action):
    def name(self):
        return 'action_restart_conversation'
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        slots_to_clear = ['user_id', 'password']
        events = [SlotSet(slot, None) for slot in slots_to_clear]

        buttons = [
            {"title": "About Expedien", "payload": '/about_expediens'},
            {"title": "Company Policy", "payload": '/company_policy'},
            {"title": "Leave", "payload": '/leave'},
            {"title": "Holiday List", "payload": '/holiday_list'}
        ]

        dispatcher.utter_message(text="Greetings and Welcome to Expediens eSolutions Ltd! How may I Help You Today?", buttons=buttons)
        return events
    

class ActionExitConversation(Action):
    def name(self):
        return 'action_exit_conversation'
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        slots_to_clear = ['user_id', 'password']
        events = [SlotSet(slot, None) for slot in slots_to_clear]
        dispatcher.utter_message(text="Bye, Have a Nice Day.")
        return events


class ActionCheckExistingCredential(Action):
    def name(self):
        return 'action_check_existing_credential'
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        sender_id = tracker.sender_id
        userID = tracker.get_slot("user_id")
        password = tracker.get_slot("password")

        if userID and password:
            return [FollowupAction('action_leave_balance')]
        
        else: 
            dispatcher.utter_message(text=f"Enter Your User ID Please:")

        return []


class ActionLeaveBalance(Action):
    def name(self) -> Text:
        return 'action_leave_balance'

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        userID = tracker.get_slot("user_id")
        password = tracker.get_slot("password")

        encoded_password = urllib.parse.quote(password.encode('utf-8'))

        url1 = f"http://192.168.10.100/ExpHrmsApi/UserLogin?userid={userID}&password={encoded_password}"
        
        try:
            response1 = requests.get(url1)

            if response1.status_code == 200:
                empData = response1.json()
                token = empData.get('token', '')
                empName = empData.get('empname', '')
                empID = empData.get('pk_empid', '')

                url2 = f"http://192.168.10.100/ExpHrmsApi/api/Leave/EmpLeaveDetails?pk_empid={empID}"

                try: 
                    headers = {'Authorization': f'Bearer {token}'}
                    response2 = requests.get(url2, headers=headers)

                    if response2.status_code == 200:
                        leaveData = response2.json()

                        extractedLeaveData = {}

                        for leave in leaveData:
                            leaveType = leave.get('leavetype', '')
                            appliedBalance = leave.get('AppliedBalance', '')

                            extractedLeaveData[leaveType] = appliedBalance

                        data = {
                            "title": "Leaves",
                            "labels": list(extractedLeaveData.keys()),
                            "backgroundColor": ["#FF5733","#4CAF50","#3498DB","#FFC300","#E74C3C","#9B59B6","#2ECC71"],
                            "chartsData": list(extractedLeaveData.values()),
                            "chartType": "pie",
                            "displayLegend": "true"
                        }

                        message = {"payload": "chart", "data": data}

                        buttons = [
                                    {"title": "Exit", "payload": "exit"},
                                    {"title": "Main Menu", "payload": "main_menu"}
                                    
                                ]

                        dispatcher.utter_message(text=f"Hello {empName}, Your Leave Balance Details:", json_message=message, buttons=buttons)
                         

                    else:
                        return [FollowupAction('action_leave_balance_try_again')]

                except Exception as e:
                    return [FollowupAction('action_leave_balance_try_again')]
                  

            else:
                return [FollowupAction('action_leave_balance_try_again')]

        except Exception as e:
                return [FollowupAction('action_leave_balance_try_again')]

        return []


class ActionLeaveBalanceTryAgain(Action):
    def name(self):
        return 'action_leave_balance_try_again'
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        slots_to_clear = ['user_id', 'password']
        events = [SlotSet(slot, None) for slot in slots_to_clear]
        buttons = [
                    {"title":"Try Again","payload":"leave_balance"},
                    {"title":"Main Menu","payload":"main_menu"}
                ]
        dispatcher.utter_message(text=f"Sorry, Failed to Fetch Data.",buttons=buttons)
        
        return events