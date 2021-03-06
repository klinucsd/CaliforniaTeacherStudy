import React from 'react';
import 'antd/dist/antd.css';
import '../../index.css';
import '../questionnarie.css';
import {Checkbox, Table, Card, Input, Button} from "antd";
import QuestionnariePane from "./QuestionnariePane";
import TopicPane from "./TopicPane";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import preselected_variables from '../../../../model/preselected_variables';
import axios from "axios";

const {Search} = Input;

class TopicVariableTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            questionnarie: this.props.questionnarie ?
                this.props.questionnarie : ['Q1', 'Q2', 'Q3', 'Q4', 'Q4mini', 'Q5', 'Q5mini', 'Q6'],
            topics: this.props.topics ? this.props.topics : ['Pre-selected variables'],
            columns: [],
            data: [],
            loading: false,
            variable_selected: this.props.getSelectedVariables(),
            checkedAll: true,
            searchTerm: this.props.searchTerm,
        };

        this.topicRef = React.createRef();
    }

    componentDidMount() {

        this.setState({
            loading: true
        });

        let thisState = this;
        axios.post('/api/topic_for_original_design',
            {
                search: {
                    questionnarie: this.state.questionnarie,
                    topics: this.state.topics,
                    searchTerm: this.state.searchTerm
                }
            })
            .then(function (response) {
                thisState.setState({
                    data: response.data,
                    columns: thisState.getColumns(response.data),
                    loading: false,
                });

            });

        this.topicRef.current.setSearchTerm(this.state.searchTerm);
    }

    reset = () => {
        /*
        let variable_selected = {};
        Object.keys(this.state.variable_selected).forEach(function (key) {
            variable_selected[key] = {};
        });
        */

        let variable_selected = {
            "Q1": {
                'age_at_baseline': true,
                'adopted': true,
                'twin': true,
                'birthplace': true,
                'birthplace_mom': true,
                'birthplace_dad': true,
                'participant_race': true,
                'nih_ethnic_cat': true,
                'age_mom_atbirth': true,
                'age_dad_atbirth': true,
                'menarche_age': true,
                'oralcntr_ever_q1': true,
                'oralcntr_yrs': true,
                'fullterm_age1st': true,
                'preg_ever_q1': true,
                'preg_total_q1': true,
                'meno_stattype': true,
                'height_q1': true,
                'weight_q1': true,
                'bmi_q1': true,
                'endoca_self_q1': true,
                'cervca_self_q1': true,
                'ovryca_self_q1': true,
                'lungca_self_q1': true,
                'leuk_self_q1': true,
                'hodg_self_q1': true,
                'colnca_self_q1': true,
                'thyrca_self_q1': true,
                'meln_self_q1': true,
                'diab_self_q1': true,
                'hbp_self_q1': true,
                'brca_selfsurvey': true,
                'allex_hrs_q1': true,
                'allex_life_hrs': true,
                'vit_mulvit_q1': true,
                'alchl_analyscat': true,
                'smoke_expocat': true,
                'smoke_totyrs': true,
                'smoke_totpackyrs': true,
                'cig_day_avg': true,
            }, "Q2": {}, "Q3": {}, "Q4": {}, "Q4mini": {}, "Q5": {}, "Q5mini": {}, "Q6": {}
        };

        this.setState({
            variable_selected: variable_selected,
            questionnarie: ['Q1', 'Q2', 'Q3', 'Q4', 'Q4mini', 'Q5', 'Q5mini', 'Q6'],
            topics: ['Pre-selected variables'],
        });
        this.props.setSelectedVariablesWithQuestionnarie(variable_selected);
        this.props.setSelectedTopicsAndQuestionnarie(
            ['Q1', 'Q2', 'Q3', 'Q4', 'Q4mini', 'Q5', 'Q5mini', 'Q6'],
            ['Pre-selected variables']);
    }

    onSearchTermChange = (evt) => {
        this.setState({
            searchTerm: evt.target.value
        });

        this.props.setSearchTerm(evt.target.value);
    }

    onSearch = (searchTerm) => {
        this.setState({
            searchTerm,
            loading: true
        });

        let thisState = this;
        axios.post('/api/topic_for_original_design',
            {
                search: {
                    questionnarie: this.state.questionnarie,
                    topics: this.state.topics,
                    searchTerm
                }
            })
            .then(function (response) {
                thisState.setState({
                    data: response.data,
                    columns: thisState.getColumns(response.data),
                    loading: false,
                });
            });

        this.topicRef.current.setSearchTerm(searchTerm);

    }

    onQuestionnarieChanged = (questionnarie) => {
        let result = [];
        for (var i = 0; i < questionnarie.length; i++) {
            if (questionnarie[i].selected === true) {
                result.push(questionnarie[i].key);
            }
        }

        this.setState({
            questionnarie: result
        }, this.refreshTable);

    }

    onTopicChanged = (topics) => {
        let result = [];
        for (var i = 0; i < topics.length; i++) {
            if (topics[i].selected === true) {
                result.push(topics[i].name);
            }
        }

        this.setState({
            topics: result
        }, this.refreshTable);
    }

    onVariableCheckboxChange = (evt) => {
        let variable_selected = this.state.variable_selected;
        if (evt.target.checked) {
            variable_selected[evt.target.value.questionnarie][evt.target.value.variable] = true;
        } else {
            if (preselected_variables.includes(evt.target.value.variable) && evt.target.value.questionnarie === 'Q1') {
                variable_selected[evt.target.value.questionnarie][evt.target.value.variable] = true;
            } else {
                variable_selected[evt.target.value.questionnarie][evt.target.value.variable] = undefined;
            }
        }

        this.setState({
            variable_selected: variable_selected
        });

        this.props.setSelectedVariablesWithQuestionnarie(variable_selected);
    }

    onChangeSelectAll = (evt) => {
        if (evt.target.checked) {
            let variable_selected = this.state.variable_selected;
            for (var i = 0; i < this.state.data.length; i++) {
                let variable = this.state.data[i].variable;
                let questionnarie = this.state.data[i].questionnarie;
                variable_selected[questionnarie][variable] = true;
            }
            this.setState({
                variable_selected,
            });
            this.props.setSelectedVariablesWithQuestionnarie(variable_selected);
        } else {
            let variable_selected = this.state.variable_selected;
            for (i = 0; i < this.state.data.length; i++) {
                let variable = this.state.data[i].variable;
                let questionnarie = this.state.data[i].questionnarie;

                if (preselected_variables.includes(variable) && questionnarie === 'Q1') {
                    variable_selected[questionnarie][variable] = true;
                } else {
                    variable_selected[questionnarie][variable] = undefined;
                }
            }
            this.setState({
                variable_selected,
            });
            this.props.setSelectedVariablesWithQuestionnarie(variable_selected);
        }

    }

    refreshTable = () => {
        this.setState({
            loading: true
        });

        let thisState = this;
        axios.post('/api/topic_for_original_design',
            {
                search: {
                    questionnarie: this.state.questionnarie,
                    topics: this.state.topics,
                    searchTerm: this.state.searchTerm
                }
            })
            .then(function (response) {
                thisState.setState({
                    data: response.data,
                    columns: thisState.getColumns(response.data),
                    loading: false,
                });
            });
    }

    isAllChecked = (data) => {
        let variable_selected = this.state.variable_selected;
        for (var i = 0; i < data.length; i++) {
            let variable = data[i].variable;
            let questionnarie = data[i].questionnarie;
            if (variable_selected[questionnarie][variable] === undefined) {
                return false;
            }
        }
        return true;
    }

    viewBySections = () => {
        this.props.viewBySections();
        this.props.setSelectedTopicsAndQuestionnarie(this.state.questionnarie, this.state.topics);
    }

    getColumns = (data) => {
        let thisState = this;

        console.log("----------------------------------");
        console.log(JSON.stringify(thisState.state.variable_selected, null, 2));


        return [
            {
                title: 'Topic',
                dataIndex: 'topic',
                width: 130,
                render: (text, row, index) => {
                    if (index === 0 || data[index].topic !== data[index - 1].topic) {
                        var count = 1;
                        for (var i = index + 1; i < data.length; i++) {
                            if (data[i].topic === data[index].topic) {
                                count++;
                            } else {
                                break;
                            }
                        }
                        return {
                            props: {
                                style: {fontWeight: 'normal',
                                    verticalAlign: 'top',
                                    backgroundColor: text === 'Pre-selected variables' ? '#e8f5e9' : 'white'
                                },
                                rowSpan: count,
                            },
                            children: <div style={{
                                fontWeight: 'bold',
                                fontSize: 12,
                            }}>{text}</div>
                        };
                    } else {
                        return {
                            children: <div>{text}</div>,
                            props: {
                                colSpan: 0
                            },
                        };
                    }
                },
            },
            {
                title: 'Variable Name',
                dataIndex: 'variable',
                width: 130,
                render: (text, row, index) => {
                    return {
                        children: (
                            <Tooltip placement="bottom-start"
                                     title={
                                         <React.Fragment>
                                             {
                                                 (
                                                     row.questionnarie === 'Q4mini' ?
                                                         'Q4 Mini'
                                                         :
                                                         row.questionnarie === 'Q5mini' ?
                                                             'Q5 Mini'
                                                             :
                                                             row.questionnarie
                                                 )
                                                 + " : " +
                                                 row.section.charAt(0).toUpperCase() +
                                                 row.section.slice(1).toLowerCase()
                                             }
                                         </React.Fragment>
                                     }
                                     color={'#334d99'}>
                                <div>{text}</div>
                            </Tooltip>
                        ),
                        props: {
                            style: {
                                fontWeight: 'normal',
                                verticalAlign: 'top',
                                fontSize: 12,
                                backgroundColor: index % 2 === 0 ?
                                    (row.questionnarie === 'Q1' && preselected_variables.includes(row.variable) ?
                                        '#E0EEE0' : 'white')
                                    :
                                    (row.questionnarie === 'Q1' && preselected_variables.includes(row.variable) ?
                                        '#e8f5e9' : '#eee'),
                            },
                        },
                    };
                },
            },
            {
                title: 'Description',
                dataIndex: 'description',
                render: (text, row, index) => {
                    return {
                        children:
                            (
                                <Tooltip placement="bottom-start"
                                         title={
                                             <React.Fragment>
                                                 {
                                                     row.values ?
                                                         row.values.split('\n').map((value, i) => (
                                                             <div key={'row-' + index + '-' + i}>{value}</div>
                                                         )) : null
                                                 }
                                             </React.Fragment>
                                         }
                                         color={'#334d99'}>
                                    <div>{text}</div>
                                </Tooltip>
                            ),
                        props: {
                            style: {
                                fontWeight: 'normal',
                                verticalAlign: 'top',
                                fontSize: 12,
                                backgroundColor: index % 2 === 0 ?
                                    (row.questionnarie === 'Q1' && preselected_variables.includes(row.variable) ?
                                        '#E0EEE0' : 'white')
                                    :
                                    (row.questionnarie === 'Q1' && preselected_variables.includes(row.variable) ?
                                        '#e8f5e9' : '#eee'),
                            }
                        },
                    };
                },
            },
            {
                title: <Checkbox onChange={thisState.onChangeSelectAll}></Checkbox>,
                width: 25,
                render(text, row, index) {
                    return {
                        props: {
                            style: {
                                width: '20px',
                                fontWeight: 'normal',
                                backgroundColor: index % 2 === 0 ?
                                    (row.questionnarie === 'Q1' && preselected_variables.includes(row.variable) ?
                                        '#E0EEE0' : 'white')
                                    :
                                    (row.questionnarie === 'Q1' && preselected_variables.includes(row.variable) ?
                                        '#e8f5e9' : '#eee'),
                                textAlign: 'left'
                            }
                        },
                        children: <Checkbox value={row}
                                            checked={thisState.state.variable_selected[row.questionnarie][row.variable]}
                                            disabled={row.questionnarie === 'Q1' && preselected_variables.includes(row.variable)}
                                            onChange={thisState.onVariableCheckboxChange}>
                        </Checkbox>
                    };
                }
            }
        ];
    }


    render() {
        return (
            <div style={{padding: '10pt 3pt 10pt 0pt'}}>
                <table border={0}
                       style={{width: '100%', margin: '0pt 0pt 10pt 0pt', height: '100vh'}}>
                    <tbody>
                    <tr>
                        <td colSpan={3} style={{width: '100%', textAlign: 'right'}}>

                            <Button style={{margin: '0pt 5pt 4pt 0pt'}}
                                    onClick={this.viewBySections}>
                                View by Sections
                            </Button>

                            <Search placeholder="input search text"
                                    allowClear
                                    onSearch={this.onSearch}
                                    value={this.state.searchTerm}
                                    onChange={this.onSearchTermChange}
                                    style={{width: '150pt'}}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style={{width: '150pt', verticalAlign: 'top', padding: '0pt 5pt 10pt 5pt'}}>

                            <Card size="small"
                                  title="#Topic"
                                  headStyle={{backgroundColor: '#e1e1e1'}}
                                  style={{width: '150pt', marginTop: '0pt'}}>
                                <TopicPane topics={this.props.topics}
                                           onTopicChanged={this.onTopicChanged}
                                           ref={this.topicRef}/>
                            </Card>

                            <div style={{height: '7pt'}}></div>
                            <Card size="small"
                                  title="Questionnaire"
                                  headStyle={{backgroundColor: '#e1e1e1'}}
                                  style={{width: '150pt'}}>
                                <QuestionnariePane questionnarie={this.props.questionnarie}
                                                   onQuestionnarieChanged={this.onQuestionnarieChanged}
                                                   ref={this.questionnarieRef}
                                />
                            </Card>

                        </td>
                        <td style={{
                            width: '100%',
                            minWidth: '200pt',
                            verticalAlign: 'top',
                            padding: '0pt 0pt 10pt 0pt',
                            height: '100%',
                        }}>

                            <div style={{backgroundColor: 'white', height: '100%'}}>
                                <Table
                                    columns={this.state.columns}
                                    dataSource={this.state.data}
                                    size="small"
                                    bordered
                                    pagination={false}
                                    loading={this.state.loading}
                                    style={{fontSize: 12}}
                                    rowKey={() => 'key-' + new Date().getTime()}
                                />
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );
    }

}

export default TopicVariableTable;
