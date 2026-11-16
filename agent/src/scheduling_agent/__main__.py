from pipecat.runner import run

from scheduling_agent.bot import bot
from scheduling_agent.config import get_settings


def main() -> None:
    settings = get_settings()
    run.RUNNER_HOST = settings.agent_host
    run.RUNNER_PORT = settings.agent_port
    run.main()


__all__ = ["bot"]

if __name__ == "__main__":
    main()
