class Reminder {
    constructor(
        public id: string,
        public text: string,
        public date: string
    ) {}
}

class ReminderDatabase {
    private reminders: Reminder[] = [];

    createReminder(id: string, text: string, date: string) {
        this.reminders.push(new Reminder(id, text, date));
    }

    exists(id: string): boolean {
        return this.reminders.some(reminder => reminder.id === id);
    }

    getAllReminders(): Reminder[] {
        return this.reminders;
    }

    getReminder(id: string): Reminder | null {
        return this.reminders.find(reminder => reminder.id === id) || null;
    }

    removeReminder(id: string): boolean {
        const index = this.reminders.findIndex(reminder => reminder.id === id);
        if (index !== -1) {
            this.reminders.splice(index, 1);
            return true;
        }
        return false;
    }

    updateReminder(id: string, text: string, date: string): boolean {
        const reminder = this.getReminder(id);
        if (reminder) {
            reminder.text = text;
            reminder.date = date;
            return true;
        }
        return false;
    }
}

const db = new ReminderDatabase();

const getInput = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        process.stdout.write(question);
        process.stdin.once("data", (data) => resolve(data.toString().trim()));
    });
};

const main = async () => {
    while (true) {
        console.log("1. Create Reminder");
        console.log("2. View All Reminders");
        console.log("3. Get Reminder");
        console.log("4. Remove Reminder");
        console.log("5. Update Reminder");
        console.log("6. Exit");

        const choice = await getInput("Choose an option: ");

        switch (choice) {
            case "1": {
                const id = await getInput("Enter ID: ");
                const text = await getInput("Enter Reminder Text: ");
                const date = await getInput("Enter Date (YYYY-MM-DD): ");
                db.createReminder(id, text, date);
                console.log("Reminder created successfully!");
                break;
            }
            case "2": {
                console.log("All Reminders:", db.getAllReminders());
                break;
            }
            case "3": {
                const id = await getInput("Enter Reminder ID: ");
                console.log("Reminder:", db.getReminder(id));
                break;
            }
            case "4": {
                const id = await getInput("Enter Reminder ID to remove: ");
                console.log(db.removeReminder(id) ? "Reminder removed." : "Reminder not found.");
                break;
            }
            case "5": {
                const id = await getInput("Enter Reminder ID to update: ");
                const text = await getInput("Enter new Reminder Text: ");
                const date = await getInput("Enter new Date (YYYY-MM-DD): ");
                console.log(db.updateReminder(id, text, date) ? "Reminder updated." : "Reminder not found.");
                break;
            }
            case "6":
                console.log("Exiting...");
                process.exit(0);
            default:
                console.log("Invalid option. Try again.");
        }
    }
};

main();