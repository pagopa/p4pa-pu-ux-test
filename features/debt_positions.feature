@debt_positions
Feature: An organization manages debt positions

    @aca
    Scenario: Organization interacting with ACA creates a simple debt position with single installment
        Given the admin user of Ente locale logs in
        And enters the 'Debt positions' section on the menu and clicks on 'Create new'
        When inserts correctly a debt position with payment option having single installment of 51,60 euros and clicks on 'Create'
        Then the message 'Debt position is been created' appears
        When in the search section in tab 'Debt position' filters by fiscal code, debt position type and status 'Unpaid'
        Then the new debt position is present in the list in status 'Unpaid'
        And by clicking on action icon, the debt position details are visible


    @gpd
    Scenario: Organization interacting with GPD creates a simple debt position with single installment
        Given the admin user of Ente P4PA intermediato 2 logs in
        And enters the 'Debt positions' section on the menu and clicks on 'Create new'
        When inserts correctly a debt position with payment option having single installment of 51,60 euros and clicks on 'Create'
        Then the message 'Debt position is been created' appears
        When in the search section in tab 'Debt position' filters by fiscal code, debt position type and status 'Unpaid'
        Then the new debt position is present in the list in status 'Unpaid'
        And by clicking on action icon, the debt position details are visible
        
