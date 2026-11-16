from pipecat.utils.text.transforms.replacements import replace_text

SPOKEN_FORMS = replace_text([(r"\b911\b", "nine one one")])
