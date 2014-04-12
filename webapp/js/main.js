function refreshTables() {
    var fixtureCols = {
            fixtureId: {
              index: 1,
              type: "number",
              unique: true,
              hidden: true
            },
            div: {
              index: 2,
              type: "string",
              friendly: "Division"
            },
            matchDate: {
              index: 3,
              type: "date",
              friendly: "Match Date"
            },
            homeTeam: {
              index: 4,
              type: "string",
              friendly: "Home Team"
            },
            awayTeam: {
              index: 5,
              type: "string",
              friendly: "Away Team"
            },
            ftHomeGoals: {
              index: 6,
              type: "number",
              friendly: "FT Home Goals"
            },
            ftAwayGoals: {
              index: 7,
              type: "number",
              friendly: "FT Away Goals"
            },
            ftResult: {
              index: 8,
              type: "string",
              friendly: "FT Result"
            },
            status: {
              index: 9,
              type: "string",
              friendly: "Status"
            }
          };
        

        var fixtureRows = [];
        $.get('api/fixture', function(data) {
          for (var i=0; i<data.length; i++) {
            var row = {};
            row.fixtureId = data[i].ID;
            row.div = data[i].DIVISION;
            row.divFormat = "<img src='img/" + row.div + ".gif' />&nbsp;&nbsp;{0}";
            row.matchDate = data[i].MATCH_DATE;
            row.homeTeam = data[i].HOME_TEAM;
            row.awayTeam = data[i].AWAY_TEAM;
            row.ftHomeGoals = data[i].FT_HOME_GOALS;
            row.ftAwayGoals = data[i].FT_AWAY_GOALS;
            row.ftResult = data[i].FT_RESULT;
            row.status = data[i].STATUS;
            fixtureRows.push(row);
          }

          var enddata = {
            cols: fixtureCols,
            rows: fixtureRows
          };
          
          fixtureTable.setData(enddata);
        });

        window.sequenceCols = {
                internalId: {
                  index: 1,
                  type: "number",
                  unique: true,
                  hidden: true
                },
                id: {
                  index: 2,
                  type: "string",
                  hidden: true
                },
                team: {
                  index: 3,
                  type: "string",
                  friendly: "Team"
                },
                status: {
                  index: 4,
                  type: "string",
                  friendly: "Sequence Status"
                },
                dateStarted: {
                  index: 5,
                  type: "date",
                  friendly: "Date Started"
                },
                fixtureId: {
                  index: 6,
                  type: "number",
                  hidden: true
                },
                division: {
                  index: 7,
                  type: "string",
                  friendly: "Division"
                },
                fixtureDate: {
                  index: 8,
                  type: "date",
                  friendly: "Fixture Date"
                },
                homeTeam: {
                  index: 9,
                  type: "string",
                  friendly: "Home Team"
                },
                awayTeam: {
                  index: 10,
                  type: "string",
                  friendly: "Away Team"
                },
                amount: {
                  index: 11,
                  type: "number",
                  friendly: "Amount Put"
                },
                odd: {
                  index: 12,
                  type: "number",
                  friendly: "Odd"
                },
                result: {
                  index: 13,
                  type: "string",
                  friendly: "Result"
                }
              };

        var sequenceRows = [];
        window.sequenceLeagues = {
          'PR' : [],
          'ECH' : [],
          'L1' : [],
          'L2' : [],
          'A' : [],
          'B' : [],
          'BL' : [],
          '2BL' : []
        };
        $.get('api/sequence', function(sequenceData) {
          $.get('api/fixture', function(fixtureData) {
            $.get('api/bet', function(betData) {
              var internalId = 0;
              for (var i=0; i<sequenceData.length; i++) {

                if (sequenceData[i].status === 'FINISHED') {
                  continue;
                }

                internalId++;
                var mainSequenceRow = {};
                mainSequenceRow.internalId = internalId;
                mainSequenceRow.id = sequenceData[i].id;
                mainSequenceRow.team = sequenceData[i].team;
                mainSequenceRow.status = sequenceData[i].status;
                mainSequenceRow.dateStarted = sequenceData[i].dateStarted;
                //sequenceRows.push(sequenceRow);
                var isSequencePushed = false;

                for (var j=0; j<sequenceData[i].steps.length; j++) {
                  var fixtureId = parseInt(sequenceData[i].steps[j].fixtureId, 10);
                  for (var p=0; p<fixtureData.length; p++) {
                    if (fixtureData[p].ID === fixtureId) {
                      var fixture = fixtureData[p];
                    }
                  }

                  internalId++;
                  var sequenceRow = {};
                  sequenceRow.internalId = internalId;
                  sequenceRow.fixtureId = fixture.ID;
                  sequenceRow.division = fixture.DIVISION;
                  sequenceRow.divisionFormat = "<img src='img/" + fixture.DIVISION + ".gif' />&nbsp;&nbsp;{0}";
                  sequenceRow.fixtureDate = fixture.MATCH_DATE;
                  sequenceRow.homeTeam = fixture.HOME_TEAM;
                  sequenceRow.awayTeam = fixture.AWAY_TEAM;
                  if (sequenceData[i].team === fixture.HOME_TEAM) {
                    sequenceRow.homeTeamFormat = "<strong>{0}</strong>";
                  }
                  if (sequenceData[i].team === fixture.AWAY_TEAM) {
                    sequenceRow.awayTeamFormat = "<strong>{0}</strong>";
                  }

                  for (var q=0; q<betData.length; q++) {
                    if (betData[q].FIXTURE_ID === sequenceData[i].steps[j].fixtureId) {
                      sequenceRow.amount = betData[q].AMOUNT;
                      sequenceRow.odd = betData[q].ODD;
                      sequenceRow.result = betData[q].RESULT;
                      var resultClass = '';
                      if (sequenceRow.result === 'WIN') {
                        resultClass = 'green';
                      } else if (sequenceRow.result === 'LOSE') {
                        resultClass = 'red';
                      } else if (sequenceRow.result === 'PENDING') {
                        resultClass = 'yellow';
                      }
                      sequenceRow.resultFormat = "<div class='" + resultClass + "'>{0}</div>";
                    }
                  }

                  //sequenceRows.push(sequenceRow);
                  if (!isSequencePushed) {
                    sequenceLeagues[fixture.DIVISION].push(mainSequenceRow);
                    isSequencePushed = true;
                  }
                  sequenceLeagues[fixture.DIVISION].push(sequenceRow);

                }
              }

              var selectLeague = window.selectedLeague || 'PR';
              sequenceTable.setData({cols: sequenceCols, rows: sequenceLeagues[selectLeague]});
            });
          });
        });


    window.nodrawsLeagues = {
      'PR' : [],
      'ECH' : [],
      'L1' : [],
      'L2' : [],
      'A' : [],
      'B' : [],
      'BL' : [],
      '2BL' : []
    };
    window.drawsCols = {
        teamName: {
          index: 1,
          type: "string",
          unique: true,
          friendly: "Team Name"
        },
        division: {
          index: 2,
          type: "string",
          friendly: "Division"
        },
        series: {
          index: 3,
          type: "number",
          friendly: "Matches wo Draw"
        }
      };

    var drawsRows = [];
    $.get('api/draws', function(drawsData) {
      $.get('api/sequence', function(sequenceData) {
        drawsRows = drawsData;
        for (var i=0; i<drawsRows.length; i++) {
          drawsRows[i].divisionFormat = "<img src='img/" + drawsRows[i].division + ".gif' />&nbsp;&nbsp;{0}";  
          
          
          for (var j=0; j<sequenceData.length; j++) {
            if (sequenceData[j].status !== 'FINISHED' && sequenceData[j].team === drawsRows[i].teamName) {
              drawsRows[i].teamNameFormat = "<div class='red'>{0}</div>";
            }
          }
          nodrawsLeagues[drawsRows[i].division].push(drawsRows[i]);
        }
        
        var selectLeague = window.selectedLeague || 'PR';
        drawsTable.setData({cols: drawsCols, rows: nodrawsLeagues[selectLeague]});
      });
    });
}

function resetForm($form) {
  $form.find('input:text, input:password, input:file, select, textarea').val('');
  $form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
}