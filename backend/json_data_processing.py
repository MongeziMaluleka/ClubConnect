from ClubConnect import load_json_array, dump_json_array

def condense_cohort(mega_data_path, condensed_data_path):
    mega_data = load_json_array(mega_data_path)
    condensed_data = {'cohort_23': [student.get('member') for student in mega_data]}
    dump_json_array(condensed_data_path, condensed_data)


if __name__ == "__main__":
    condense_cohort("./cohort_2023.json", "./condensed_cohort_2023.json")