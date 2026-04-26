from datetime import datetime, timedelta

def generate_plan(tasks, daily_hours=4):
    # sort by deadline (earliest first) + high priority first
    tasks = sorted(tasks, key=lambda x: (x.deadline, -x.priority))

    plan = []
    today = datetime.now()

    for task in tasks:
        days_left = (task.deadline - today).days
        days_left = max(days_left, 1)

        # distribute task across days
        hours_per_day = daily_hours // len(tasks) if len(tasks) else daily_hours

        for i in range(min(days_left, 3)):  # limit spread
            plan.append({
                "id": task.id,
                "task": task.title,
                "date": (today + timedelta(days=i)).strftime("%Y-%m-%d"),
                "hours": hours_per_day,
                "priority": task.priority
            })

    return plan