@debt_positions
Feature: An organization manages debt positions

    @aca
    Scenario: Organization interacting with ACA creates a simple debt position with single installment
        Given the admin user of Ente locale logs in
        And enters the 'Debt positions' section on the menu and clicks on 'Create new'
        When inserts correctly a debt position with payment option having single installment of 51.6 euros and clicks on 'Create'
        Then the message 'Debt position is been created' appears


    @gpd
    Scenario: Organization interacting with GPD creates a simple debt position with single installment
        Given the admin user of Ente P4PA intermediato 2 logs in
        And enters the 'Debt positions' section on the menu and clicks on 'Create new'
        When inserts correctly a debt position with payment option having single installment of 51.6 euros and clicks on 'Create'
        Then the message 'Debt position is been created' appears
