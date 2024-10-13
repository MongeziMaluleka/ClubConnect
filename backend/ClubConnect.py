import json
def load_json_array(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    if isinstance(data, list):
        return data
    else:
        raise ValueError("The JSON file does not contain a list.")

def dump_json_array(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

def load_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

    if isinstance(data, dict):
        return data
    else:
        raise ValueError("The JSON file does not contain a dictionary.")



class ClubConnect:
    TESTIMONIAL_DATA_PATH = "./testimonial_uploads_data.json"
    CONDENSED_COHORT_23_DATA_PATH = "./condensed_cohort_2023.json"

    def __init__(self):
        self.testimonials_list = load_json_array(self.__class__.TESTIMONIAL_DATA_PATH)

    def write_testimonial_data_to_json(self, data):
#         update testimonial list with new data
        self.testimonials_list.append(data)
        dump_json_array(self.__class__.TESTIMONIAL_DATA_PATH, self.testimonials_list)

    def read_testimonial_data_from_json(self):
        return (load_json_array(self.__class__.TESTIMONIAL_DATA_PATH))

    def reload_from_file(self):
        pass

    def load_valid_cohort_23_usernames_from_json(self):
        return load_json(self.__class__.CONDENSED_COHORT_23_DATA_PATH).get("cohort_23")

